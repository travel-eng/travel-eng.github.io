(function () {
  "use strict";

  // ---------- 저장 ----------
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
  state.daily = state.daily || {};        // { "2026-11-21": { id, done } }
  state.hist = state.hist || { 1: [], 2: [], 3: [] }; // 레벨별 최근 결과 true/false
  state.voice = state.voice || "";
  state.cat = state.cat || "all";

  var PASS = 0.8;        // 단어 80% 이상 맞으면 성공
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
  function compare(target, heard) {
    var a = tokens(target), b = tokens(heard);
    var n = a.length, m = b.length, dp = [];
    for (var i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); }
    for (i = 1; i <= n; i++) for (var j = 1; j <= m; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    // 맞은 단어 표시
    var hit = new Array(n).fill(false); i = n; j = m;
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) { hit[i - 1] = true; i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
    }
    var extra = Math.max(0, m - dp[n][m]);
    // 쓸데없는 단어를 많이 더 말하면 약간 감점
    var score = n ? (dp[n][m] - Math.max(0, extra - 2) * 0.5) / n : 0;
    return { score: Math.max(0, score), words: a, hit: hit };
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
    synth.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    var v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = slow ? 0.6 : 0.9;
    synth.speak(u);
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
    btn.textContent = "👂 듣는 중… (다시 누르면 취소)";
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
      var html = (ok ? "🎉 잘했어요! (" + pct + "%)" : "😅 조금 달라요 (" + pct + "%). 밑줄 친 단어를 다시 들어 보세요.") +
        '<div class="heard">들린 말: “' + esc(bestHeard) + '”</div>' +
        (ok ? "" : '<div class="heard">문장: ' + marked + "</div>");
      showResult(resultEl, ok ? "ok" : "bad", html);
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
  function todaySentence() {
    var k = dateKey();
    var d = state.daily[k];
    if (d && byId(d.id)) return byId(d.id);
    // 아직 안 한 문장 중에서 고르기
    var used = {};
    Object.keys(state.daily).forEach(function (x) { used[state.daily[x].id] = true; });
    var p = pool(state.level, "all");
    var fresh = p.filter(function (s) { return !used[s.id]; });
    if (fresh.length) p = fresh;
    var s = p[hash(k) % p.length];
    state.daily[k] = { id: s.id, done: false };
    save();
    return s;
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
    $("todayDate").textContent = (d.getMonth() + 1) + "월 " + d.getDate() + "일 · 오늘의 문장";
    $("todayEn").textContent = s.en;
    $("todayKo").textContent = s.ko;
    var done = state.daily[dateKey()].done;
    var btn = $("todayDone");
    btn.disabled = done;
    btn.textContent = done ? "✔ 오늘 완료!" : "✔ 오늘 문장 외웠어요";
    var total = Object.keys(state.daily).filter(function (k) { return state.daily[k].done; }).length;
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
    ["today", "practice", "list", "settings"].forEach(function (t) {
      $("tab-" + t).classList.toggle("hidden", t !== name);
    });
    Array.prototype.forEach.call(document.querySelectorAll("nav button"), function (b) {
      b.classList.toggle("on", b.dataset.tab === name);
    });
    if (name === "list") renderList();
    if (name === "today") renderToday();
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
    $("todayMic").onclick = function () { listen($("todayMic"), $("todayEn").textContent, $("todayResult")); };
    $("todayDone").onclick = function () { state.daily[dateKey()].done = true; save(); renderToday(); };
    // 연습
    fillCatSelect($("catSelect"), state.cat);
    $("catSelect").onchange = function () { state.cat = this.value; save(); nextPractice(); };
    $("pListen").onclick = function () { speak(current.en); };
    $("pSlow").onclick = function () { speak(current.en, true); };
    $("pMic").onclick = function () { listen($("pMic"), current.en, $("pResult"), record); };
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
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  // 테스트용으로 비교 함수 공개
  window.__te = { compare: compare, tokens: tokens, levelOf: levelOf };
  init();
})();
