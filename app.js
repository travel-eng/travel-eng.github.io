(function () {
  "use strict";

  // ---------- 저장 ----------
  var APP_VERSION = "1.21 (2026-11-26)";
  var KEY = "travelEnglish.v1";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  var state = load();
  state.level = state.level || 1;
  state.mine = state.mine || [];          // 내가 추가한 문장 [{en, ko}]
  state.daily = state.daily || {};        // { "2026-11-21": { ids:[2개], dones:[..], id, done(둘 다 했는지) } }
  state.hist = state.hist || { 1: [], 2: [], 3: [] }; // 레벨별 최근 결과 true/false
  state.voice = state.voice || "";
  state.cat = state.cat || "all";

  var PASS = 0.7;        // 70% 이상이면 성공 (비슷한 발음도 인정)
  var ALMOST = 0.5;      // 50% 이상이면 "거의 맞았어요"
  var UP_WINDOW = 5;     // 최근 5번 중
  var UP_NEED = 4;       // 4번 이상 성공하면 다음 레벨 추천
  var DOWN_FAILS = 3;    // 3번 연속 실패하면 한 단계 내려감

  // ---------- 문장 ----------
  function wordCount(s) { return tokens(s).length; }
  function levelOf(s) { var n = wordCount(s); return n <= 4 ? 1 : n <= 8 ? 2 : 3; }

  function allSentences() {
    var list = window.PRESET_SENTENCES.map(function (s, i) {
      return { id: "p" + i, cat: s.cat, en: s.en, ko: s.ko };
    });
    state.mine.forEach(function (s, i) {
      list.push({ id: "m" + s.t, cat: "mine", en: s.en, ko: s.ko });
    });
    if (window.STORY) window.STORY.episodes.forEach(function (ep, n) {
      ep.lines.forEach(function (l, k) {
        if (l.who === "me") list.push({ id: "s" + n + "_" + k, cat: "story", en: l.en, ko: l.ko });
      });
    });
    list.forEach(function (s) { s.level = levelOf(s.en); });
    return list;
  }
  function byId(id) {
    var all = allSentences();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function pool(level, cat) {
    var all = allSentences();
    var p = all.filter(function (s) { return s.level === level && (cat === "all" || !cat || s.cat === cat); });
    if (!p.length) p = all.filter(function (s) { return s.level === level; });
    if (!p.length) p = all;
    return p;
  }

  // ---------- 비교 (말한 것 vs 문장) ----------
  var CONTRACTIONS = {
    "i'm": "i am", "you're": "you are", "it's": "it is", "that's": "that is", "what's": "what is",
    "where's": "where is", "there's": "there is", "here's": "here is", "i'll": "i will", "we'll": "we will",
    "i'd": "i would", "we'd": "we would", "don't": "do not", "doesn't": "does not", "didn't": "did not",
    "can't": "can not", "cannot": "can not", "won't": "will not", "isn't": "is not", "aren't": "are not",
    "wasn't": "was not", "i've": "i have", "let's": "let us", "couldn't": "could not"
  };
  var NUMS = ["zero","one","two","three","four","five","six","seven","eight","nine","ten",
    "eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];
  function tokens(s) {
    s = String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/wi-?fi/g, "wifi").replace(/-/g, " ");
    s = s.replace(/[^a-z0-9' ]+/g, " ");
    var out = [];
    s.split(/\s+/).forEach(function (w) {
      w = w.replace(/^'+|'+$/g, "");
      if (!w) return;
      if (CONTRACTIONS[w]) { out.push.apply(out, CONTRACTIONS[w].split(" ")); return; }
      if (/^\d+$/.test(w) && +w <= 20) { out.push(NUMS[+w]); return; }
      if (w === "ok") w = "okay";
      out.push(w);
    });
    return out;
  }
  // 문장 단어 중 몇 개를 순서대로 말했는지 (LCS)
  // 비슷한 단어 판단 (폰이 seat를 sit로 알아듣는 것 같은 경우를 인정)
  function lev(x, y) {
    var d = [], i, j;
    for (i = 0; i <= x.length; i++) { d[i] = [i]; }
    for (j = 1; j <= y.length; j++) d[0][j] = j;
    for (i = 1; i <= x.length; i++) for (j = 1; j <= y.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    return d[x.length][y.length];
  }
  function skel(w) {
    w = w.replace(/ph/g, "f").replace(/th/g, "t").replace(/ck/g, "k").replace(/c/g, "k").replace(/z/g, "s").replace(/v/g, "b").replace(/'/g, "");
    return w[0] + w.slice(1).replace(/[aeiouyhw]/g, "").replace(/(.)\1+/g, "$1");
  }
  function wordSim(x, y) {
    if (x === y) return 1;
    if (x.length >= 3 && y.length >= 3 && skel(x) === skel(y)) return 0.85;
    var L = Math.max(x.length, y.length);
    if (L >= 4 && 1 - lev(x, y) / L >= 0.6) return 0.75;
    return 0;
  }
  var SMALL = { a: 1, an: 1, the: 1, to: 1, is: 1, of: 1, am: 1, are: 1, it: 1, do: 1, for: 1, at: 1, in: 1, on: 1 };
  // 문장 단어 중 몇 개를 순서대로 말했는지 (비슷한 단어도 인정, 작은 단어는 덜 중요)
  function compare(target, heard) {
    var a = tokens(target), b = tokens(heard);
    var n = a.length, m = b.length, dp = [], i, j;
    var wt = a.map(function (w) { return SMALL[w] ? 0.5 : 1; });
    for (i = 0; i <= n; i++) dp.push(new Array(m + 1).fill(0));
    for (i = 1; i <= n; i++) for (j = 1; j <= m; j++) {
      var sm = wordSim(a[i - 1], b[j - 1]);
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], sm ? dp[i - 1][j - 1] + sm * wt[i - 1] : 0);
    }
    var hit = new Array(n).fill(false); i = n; j = m;
    while (i > 0 && j > 0) {
      var s2 = wordSim(a[i - 1], b[j - 1]);
      if (s2 && dp[i][j] === dp[i - 1][j - 1] + s2 * wt[i - 1]) { hit[i - 1] = true; i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
    }
    var total = wt.reduce(function (x, y) { return x + y; }, 0);
    var matched = hit.filter(Boolean).length;
    var extra = Math.max(0, m - matched);
    var score = total ? (dp[n][m] - Math.max(0, extra - 3) * 0.3) / total : 0;
    return { score: Math.max(0, Math.min(1, score)), words: a, hit: hit };
  }

  // ---------- 듣기 (TTS) ----------
  var synth = window.speechSynthesis;
  var voices = [];
  function loadVoices() {
    if (!synth) return;
    voices = synth.getVoices().filter(function (v) { return /^en[-_]/i.test(v.lang); });
    var sel = $("voiceSelect");
    sel.innerHTML = "";
    if (!voices.length) { sel.innerHTML = "<option>기본 목소리</option>"; return; }
    voices.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.name; o.textContent = v.name + " (" + v.lang + ")";
      if (v.name === state.voice) o.selected = true;
      sel.appendChild(o);
    });
  }
  function pickVoice() {
    if (!voices.length) return null;
    var v = voices.filter(function (x) { return x.name === state.voice; })[0];
    return v || voices.filter(function (x) { return /en[-_]US/i.test(x.lang); })[0] || voices[0];
  }
  function speak(text, slow) {
    if (!synth) { alertBox("이 브라우저는 읽어주기를 지원하지 않아요. 크롬에서 열어 주세요."); return; }
    var wasBusy = synth.speaking || synth.pending;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    var v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = slow ? 0.6 : 0.9;
    // 안드로이드 크롬은 멈춘 직후 바로 말하면 소리가 안 날 때가 있어서 아주 잠깐 기다림
    if (wasBusy) setTimeout(function () { synth.speak(u); }, 120); else synth.speak(u);
  }

  // ---------- 말하기 인식 ----------
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var rec = null;
  function listen(btn, target, resultEl, onDone) {
    if (!SR) {
      showResult(resultEl, "info", "이 브라우저는 말하기 인식을 지원하지 않아요. 안드로이드 <b>크롬(Chrome)</b> 앱에서 열어 주세요.");
      return;
    }
    if (rec) { rec.abort(); return; }
    if (synth) synth.cancel();
    rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    var gotResult = false;
    btn.classList.add("listening");
    var oldText = btn.textContent;
    btn.textContent = "👂 듣는 중…";
    showResult(resultEl, "info", "영어 문장을 말해 보세요.");
    rec.onresult = function (e) {
      gotResult = true;
      var best = null, bestHeard = "";
      var alts = e.results[0];
      for (var i = 0; i < alts.length; i++) {
        var c = compare(target, alts[i].transcript);
        if (!best || c.score > best.score) { best = c; bestHeard = alts[i].transcript; }
      }
      var ok = best.score >= PASS;
      var marked = best.words.map(function (w, i) {
        return best.hit[i] ? esc(w) : '<span class="word-miss">' + esc(w) + "</span>";
      }).join(" ");
      var pct = Math.round(best.score * 100);
      var almost = !ok && best.score >= ALMOST;
      var html = (ok ? "🎉 잘했어요! (" + pct + "%)" : almost ? "🙂 거의 다 왔어요! (" + pct + "%) 밑줄 친 단어만 한 번 더 들어 봐요." : "😅 조금 달라요 (" + pct + "%). 🔊로 듣고 천천히 다시 해 봐요.") +
        '<div class="heard">📱 폰이 들은 말: “' + esc(bestHeard) + '”</div>' +
        (ok ? "" : '<div class="heard">문장: ' + marked + "</div>") +
        (ok ? "" : '<div class="heard small">💡 폰이 짧은 말은 잘 못 알아들을 때가 많아요. 🎤을 누르고 1초 쉬었다가 또박또박 말해 보세요.</div>');
      showResult(resultEl, ok ? "ok" : almost ? "info" : "bad", html);
      if (onDone) onDone(ok);
    };
    rec.onerror = function (e) {
      gotResult = true;
      var msg = {
        "not-allowed": "마이크 사용이 막혀 있어요. 주소창 옆 자물쇠 아이콘 → 권한 → 마이크를 '허용'으로 바꿔 주세요.",
        "service-not-allowed": "마이크 사용이 막혀 있어요. 크롬에서 마이크를 허용해 주세요.",
        "no-speech": "아무 소리도 안 들렸어요. 🎤을 누르고 바로 말해 보세요.",
        "network": "인터넷 연결이 필요해요. 와이파이나 데이터를 확인해 주세요.",
        "audio-capture": "마이크를 찾지 못했어요.",
        "aborted": "취소했어요."
      }[e.error] || ("인식이 안 됐어요 (" + e.error + "). 다시 해 보세요.");
      showResult(resultEl, "info", msg);
    };
    rec.onend = function () {
      btn.classList.remove("listening");
      btn.textContent = oldText;
      if (!gotResult) showResult(resultEl, "info", "잘 안 들렸어요. 다시 해 보세요.");
      rec = null;
    };
    try { rec.start(); } catch (err) { rec = null; btn.classList.remove("listening"); btn.textContent = oldText; }
  }

  // ---------- 레벨 ----------
  function record(ok) {
    var h = state.hist[state.level] = state.hist[state.level] || [];
    h.push(ok);
    if (h.length > 20) h.shift();
    var msg = "";
    var last = h.slice(-DOWN_FAILS);
    if (!ok && state.level > 1 && last.length === DOWN_FAILS && last.every(function (x) { return !x; })) {
      state.level--;
      state.hist[state.level] = [];
      msg = '<div class="card result info">3번 연속 어려웠어요. 조금 짧은 문장(레벨 ' + state.level + ')으로 내려갈게요. 괜찮아요, 천천히 해요! 😊 [다음 문장]을 누르면 짧은 문장이 나와요.</div>';
    }
    save();
    renderLevel();
    renderDots();
    if (msg) { $("levelSuggest").innerHTML = msg; return; }
    var recent = h.slice(-UP_WINDOW);
    var wins = recent.filter(Boolean).length;
    if (state.level < 3 && recent.length >= UP_WINDOW && wins >= UP_NEED) {
      $("levelSuggest").innerHTML = '<div class="card result ok">최근 ' + UP_WINDOW + '번 중 ' + wins +
        '번 성공! 조금 더 긴 문장(레벨 ' + (state.level + 1) + ')에 도전해 볼까요?' +
        '<div class="row"><button class="primary big" id="goUp">좋아요, 올려 주세요</button><button class="big" id="stay">조금 더 할게요</button></div></div>';
      $("goUp").onclick = function () { setLevel(state.level + 1); $("levelSuggest").innerHTML = ""; };
      $("stay").onclick = function () { state.hist[state.level] = []; save(); renderDots(); $("levelSuggest").innerHTML = ""; };
    } else {
      $("levelSuggest").innerHTML = "";
    }
  }
  function setLevel(l) {
    state.level = l;
    state.hist[l] = [];
    save();
    renderLevel(); renderDots(); nextPractice();
  }
  function renderLevel() {
    var names = { 1: "짧은 문장", 2: "중간 문장", 3: "긴 문장" };
    $("levelPill").textContent = "레벨 " + state.level + " · " + names[state.level];
    Array.prototype.forEach.call(document.querySelectorAll("#levelSeg button"), function (b) {
      b.classList.toggle("on", +b.dataset.l === state.level);
    });
  }
  function renderDots() {
    var h = (state.hist[state.level] || []).slice(-10);
    var html = "";
    for (var i = 0; i < 10; i++) html += '<span class="dot ' + (i < h.length ? (h[i] ? "y" : "n") : "") + '"></span>';
    $("dots").innerHTML = html;
  }

  // ---------- 오늘의 문장 ----------
  function dateKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  var DAILY_N = 2;       // 하루 문장 개수
  var todayCur = -1;     // 지금 보고 있는 오늘 문장 번호(0, 1)
  function pickNew(k, used) {
    var p = pool(state.level, "all");
    var fresh = p.filter(function (s) { return !used[s.id]; });
    if (fresh.length) p = fresh;
    return p[(hash(k) + Object.keys(used).length * 7) % p.length];
  }
  function todayRec() {
    var k = dateKey();
    var d = state.daily[k];
    var used = {};
    Object.keys(state.daily).forEach(function (x) {
      var r = state.daily[x];
      (r.ids || [r.id]).forEach(function (id) { if (id) used[id] = true; });
    });
    if (!d) d = state.daily[k] = { ids: [], dones: [] };
    if (!d.ids) { d.ids = d.id ? [d.id] : []; d.dones = d.id ? [!!d.done] : []; }
    d.ids = d.ids.filter(function (id) { return byId(id); });
    while (d.ids.length < DAILY_N) { var s = pickNew(k, used); used[s.id] = true; d.ids.push(s.id); d.dones.push(false); }
    d.id = d.ids[0];
    d.done = d.dones.every(Boolean);
    save();
    return d;
  }
  function todaySentence() {
    var d = todayRec();
    if (todayCur < 0) { todayCur = d.dones.indexOf(false); if (todayCur < 0) todayCur = 0; }
    return byId(d.ids[todayCur]);
  }
  function streak() {
    var n = 0, d = new Date();
    if (!(state.daily[dateKey(d)] || {}).done) d.setDate(d.getDate() - 1);
    while ((state.daily[dateKey(d)] || {}).done) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function renderToday() {
    var s = todaySentence();
    var d = new Date();
    var rec = state.daily[dateKey()];
    $("todayDate").textContent = (d.getMonth() + 1) + "월 " + d.getDate() + "일 · 오늘의 문장 " + (todayCur + 1) + "/" + DAILY_N;
    $("todaySeg").innerHTML = rec.ids.map(function (id, i) {
      return '<button data-i="' + i + '" class="' + (i === todayCur ? "on" : "") + '">' + (rec.dones[i] ? "✅ " : "") + "문장 " + (i + 1) + "</button>";
    }).join("");
    Array.prototype.forEach.call($("todaySeg").querySelectorAll("button"), function (b) {
      b.onclick = function () { todayCur = +b.dataset.i; $("todayResult").innerHTML = ""; renderToday(); };
    });
    $("todayEn").textContent = s.en;
    if (window.TE && TE.decorate) TE.decorate($("todayEn"), $("todayExp"));
    $("todayKo").textContent = s.ko;
    var done = rec.dones[todayCur];
    var btn = $("todayDone");
    btn.disabled = done;
    btn.textContent = rec.done ? "✔ 오늘 2문장 완료!" : done ? "✔ 이 문장 외웠어요" : "✔ 문장 " + (todayCur + 1) + " 외웠어요";
    var total = 0;
    Object.keys(state.daily).forEach(function (k) { var r = state.daily[k]; total += r.dones ? r.dones.filter(Boolean).length : (r.done ? 1 : 0); });
    var st = streak();
    $("streak").textContent = (st ? "🔥 " + st + "일 연속 · " : "") + "지금까지 " + total + "문장 완료";
  }

  // ---------- 따라 말하기 ----------
  var current = null;
  function nextPractice() {
    var p = pool(state.level, state.cat);
    if (p.length > 1 && current) p = p.filter(function (s) { return s.id !== current.id; });
    current = p[Math.floor(Math.random() * p.length)];
    $("pEn").textContent = current.en;
    if (window.TE && TE.decorate) TE.decorate($("pEn"), $("pExp"));
    $("pKo").textContent = current.ko;
    $("pResult").innerHTML = "";
    var n = pool(state.level, state.cat).length;
    $("practiceInfo").textContent = "레벨 " + state.level + " 문장 " + n + "개 중에서 나와요";
  }

  // ---------- 문장 목록 ----------
  function fillCatSelect(sel, value) {
    sel.innerHTML = '<option value="all">전체</option>';
    Object.keys(window.CATEGORIES).forEach(function (k) {
      var o = document.createElement("option");
      o.value = k; o.textContent = window.CATEGORIES[k];
      sel.appendChild(o);
    });
    sel.value = value || "all";
  }
  function renderList() {
    var cat = $("listCat").value;
    var list = allSentences().filter(function (s) { return cat === "all" || s.cat === cat; });
    list.sort(function (a, b) { return a.level - b.level; });
    var box = $("list");
    box.innerHTML = "";
    if (!list.length) { box.innerHTML = '<div class="small">아직 문장이 없어요.</div>'; return; }
    list.forEach(function (s) {
      var div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = '<div class="txt"><div class="e"></div><div class="k"></div></div>';
      div.querySelector(".e").textContent = s.en;
      var tag = document.createElement("span"); tag.className = "tag"; tag.textContent = "L" + s.level;
      div.querySelector(".e").appendChild(tag);
      div.querySelector(".k").textContent = s.ko;
      var play = document.createElement("button"); play.textContent = "🔊";
      play.onclick = function () { speak(s.en); };
      div.appendChild(play);
      if (s.cat === "mine") {
        var del = document.createElement("button"); del.textContent = "삭제";
        del.onclick = function () {
          state.mine = state.mine.filter(function (m) { return "m" + m.t !== s.id; });
          save(); renderList();
        };
        div.appendChild(del);
      }
      box.appendChild(div);
    });
  }
  function addSentence() {
    var en = $("addEn").value.trim(), ko = $("addKo").value.trim();
    if (!en || !/[a-z]/i.test(en)) { $("addMsg").textContent = "영어 문장을 입력해 주세요."; return; }
    state.mine.push({ en: en, ko: ko || "(뜻 없음)", t: Date.now() });
    save();
    $("addEn").value = ""; $("addKo").value = "";
    $("addMsg").textContent = "추가했어요! 단어 " + wordCount(en) + "개라서 레벨 " + levelOf(en) + " 문장이에요.";
    $("listCat").value = "mine";
    renderList();
  }

  // ---------- 화면 ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function showResult(el, kind, html) { el.innerHTML = '<div class="result ' + kind + '">' + html + "</div>"; }
  function alertBox(msg) { var w = $("browserWarn"); w.textContent = msg; w.classList.remove("hidden"); }
  function showTab(name) {
    ["today", "story", "words", "game", "practice", "cal", "settings"].forEach(function (t) {
      $("tab-" + t).classList.toggle("hidden", t !== name);
    });
    Array.prototype.forEach.call(document.querySelectorAll("nav button"), function (b) {
      b.classList.toggle("on", b.dataset.tab === name);
    });
    if (name === "settings") renderList();
    if (name === "today") { renderToday(); if (window.TE.renderCalendar) window.TE.renderCalendar(); }
    if (name === "cal" && window.TE.renderCalendar) window.TE.renderCalendar();
    if (name === "words" && window.TE.renderWords) window.TE.renderWords();
    if (name === "game" && window.TE.renderGame) window.TE.renderGame();
    if (name === "story" && window.TE.renderStory) window.TE.renderStory();
    if (name === "settings" && window.TE.renderWordSettings) window.TE.renderWordSettings();
    window.scrollTo(0, 0);
  }

  function init() {
    if (!SR) {
      alertBox("⚠️ 이 브라우저에서는 '따라 말하기' 인식이 안 돼요. 안드로이드 크롬(Chrome) 앱으로 열어 주세요. 듣기와 문장 보기는 쓸 수 있어요.");
    }
    Array.prototype.forEach.call(document.querySelectorAll("nav button"), function (b) {
      b.onclick = function () { showTab(b.dataset.tab); };
    });
    // 오늘
    $("todayListen").onclick = function () { speak($("todayEn").textContent); };
    $("todaySlow").onclick = function () { speak($("todayEn").textContent, true); };
    $("todayMic").onclick = function () { listen($("todayMic"), $("todayEn").textContent, $("todayResult"), function (ok) {
      if (ok && TE.logSentence) TE.logSentence(state.daily[dateKey()].ids[todayCur]);
    }); };
    $("todayDone").onclick = function () {
      var rec = todayRec();
      rec.dones[todayCur] = true;
      if (TE.logSentence) TE.logSentence(rec.ids[todayCur]);
      rec.done = rec.dones.every(Boolean);
      var next = rec.dones.indexOf(false);
      if (next >= 0) { todayCur = next; $("todayResult").innerHTML = ""; }
      save(); renderToday(); if (window.TE.checkDay) window.TE.checkDay();
    };
    // 연습
    fillCatSelect($("catSelect"), state.cat);
    $("catSelect").onchange = function () { state.cat = this.value; save(); nextPractice(); };
    $("pListen").onclick = function () { speak(current.en); };
    $("pSlow").onclick = function () { speak(current.en, true); };
    $("pMic").onclick = function () { listen($("pMic"), current.en, $("pResult"), function (ok) {
      var id = current.id;
      record(ok);
      if (ok && TE.logSentence) TE.logSentence(id);
    }); };
    $("pNext").onclick = nextPractice;
    // 목록
    fillCatSelect($("listCat"), "all");
    $("listCat").onchange = renderList;
    $("addBtn").onclick = addSentence;
    // 설정
    Array.prototype.forEach.call(document.querySelectorAll("#levelSeg button"), function (b) {
      b.onclick = function () { setLevel(+b.dataset.l); };
    });
    $("voiceSelect").onchange = function () { state.voice = this.value; save(); };
    $("voiceTest").onclick = function () { speak("Hello! Welcome to New York."); };
    if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

    renderLevel(); renderDots(); renderToday(); nextPractice();

    if ("serviceWorker" in navigator && location.protocol === "https:") {
      navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then(function (reg) {
        TE.swReg = reg;
        // 앱을 다시 볼 때마다 새 버전 확인
        document.addEventListener("visibilitychange", function () { if (!document.hidden) reg.update().catch(function () {}); });
      }).catch(function () {});
      // 새 버전이 설치되면 한 번 자동으로 새로고침 (공부 기록은 그대로)
      var reloaded = false, hadCtrl = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (!hadCtrl) { hadCtrl = true; return; }
        if (reloaded) return; reloaded = true; location.reload();
      });
    }
  }

  // 테스트용으로 비교 함수 공개
  // 단어 기능(words-app.js)과 함께 쓰는 도구
  window.__te = { compare: compare, tokens: tokens, levelOf: levelOf };
  window.TE = {
    state: state, save: save, speak: speak, listen: listen, compare: compare, tokens: tokens,
    dateKey: dateKey, esc: esc, $: $, showResult: showResult, showTab: function (n) { showTab(n); },
    allSentences: allSentences, byId: byId, version: APP_VERSION
  };
  init();
})();
