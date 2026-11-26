(function () {
  "use strict";
  var TE = window.TE, $ = TE.$, esc = TE.esc;

  // ---------- 파닉스 사전 읽기 ----------
  var DICT = {};
  window.PHONICS_RAW.trim().split("\n").forEach(function (line) {
    var f = line.split("|");
    if (f.length < 4) return;
    DICT[f[0]] = {
      w: f[0], ipa: f[1], ko: f[2], tip: f[4] || "",
      chunks: f[3].split(/ (?=[^ ]*=)/).map(function (c) { var k = c.indexOf("="); return { l: c.slice(0, k), s: c.slice(k + 1) }; })
    };
  });
  function keyOf(word) {
    return word.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z'-]/g, "").replace(/^'+|'+$/g, "");
  }
  function lookup(word) {
    var k = keyOf(word);
    return DICT[k] || DICT[k.replace(/-/g, "")] || null;
  }

  // ---------- 파닉스 창 ----------
  function meaningOf(en) { var m = ""; (window.WORDS || []).forEach(function (w) { if (w.en.toLowerCase() === en.toLowerCase()) m = w.ko; }); return m; }
  // 두 단어 이상 (credit card, no worries 등): 묶음 전체를 보여 주고, 단어별로 눌러 볼 수 있게
  function showPhrase(phrase) {
    var words = phrase.split(/\s+/);
    var meaning = meaningOf(phrase);
    var html = '<div class="ph-word">' + esc(phrase) + "</div>";
    if (meaning) html += '<div class="ko" style="text-align:center">' + esc(meaning) + "</div>";
    var kos = words.map(function (w) { var d = lookup(w); return d ? d.ko : w; });
    html += '<div class="ph-ko">≈ ' + esc(kos.join(" ")) + "</div>";
    html += '<div class="label" style="text-align:center">단어를 누르면 하나씩 발음·어원이 나와요</div><div class="ph-chunks">' + words.map(function (w) {
      var d = lookup(w), m = meaningOf(w.replace(/[^A-Za-z']/g, ""));
      return '<div class="ph-chunk" data-pw="' + esc(w) + '"><div class="l">' + esc(w) + '</div><div class="s">' + esc(d ? "[" + d.ipa + "]" : "") + (m ? "<br>" + esc(m) : "") + "</div></div>";
    }).join("") + "</div>";
    var et = window.ETYM && window.ETYM[phrase.toLowerCase()];
    if (et) html += '<div class="etym"><div class="label">🌱 어원 (말의 뿌리)</div>' + esc(et) + "</div>";
    html += '<div class="row"><button class="big primary" id="phPlay">🔊 듣기</button><button class="big" id="phSlow">🐢 천천히</button></div>';
    $("phBody").innerHTML = html;
    $("phPlay").onclick = function () { TE.speak(phrase); };
    $("phSlow").onclick = function () { TE.speak(phrase, true); };
    Array.prototype.forEach.call($("phBody").querySelectorAll("[data-pw]"), function (c) {
      c.onclick = function () { showPhonics(c.dataset.pw, phrase); };
    });
    $("phModal").classList.remove("hidden");
    TE.speak(phrase);
  }
  function showPhonics(word, fromPhrase) {
    if (/\S\s+\S/.test(word.trim())) { showPhrase(word.trim()); return; }
    var d = lookup(word);
    var clean = word.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");
    var meaning = "";
    (window.WORDS || []).forEach(function (w) { if (w.en.toLowerCase() === clean.toLowerCase()) meaning = w.ko; });
    var html = '<div class="ph-word">' + esc(clean) + "</div>";
    if (meaning) html += '<div class="ko" style="text-align:center">' + esc(meaning) + "</div>";
    if (d) {
      html += '<div class="ph-ipa">[' + esc(d.ipa) + ']</div><div class="ph-ko">≈ ' + esc(d.ko) + "</div>";
      html += '<div class="label" style="text-align:center">글자를 누르면 다시 들려요 · 이렇게 소리 나요</div><div class="ph-chunks">' + d.chunks.map(function (c) {
        var silent = c.s.indexOf("소리 안 남") >= 0;
        return '<div class="ph-chunk' + (silent ? " silent" : "") + '"><div class="l">' + esc(c.l) + '</div><div class="s">' + esc(silent ? "묵음" : c.s) + "</div></div>";
      }).join("") + "</div>";
      var tips = [];
      if (d.tip) tips.push("💡 " + d.tip);
      var marks = d.chunks.map(function (c) { return c.s; }).join(" ");
      ["(r)", "(th)", "(f)", "(v)"].forEach(function (m) { if (marks.indexOf(m) >= 0) tips.push("👄 " + window.SOUND_TIPS[m]); });
      if (/(^|\s)(l|ll|le)=/.test(d.chunks.map(function (c) { return c.l + "=" + c.s; }).join(" ")) && marks.indexOf("(r)") >= 0) tips.push("👄 " + window.SOUND_TIPS["ㄹ_l"]);
      html += tips.map(function (t) { return '<div class="ph-tip">' + esc(t) + "</div>"; }).join("");
      html += '<div class="small" style="margin-top:10px">한글은 비슷한 소리일 뿐이에요. (r)(f)(v)(th) 표시는 한국어에 없는 소리라서 입 모양을 따로 연습해야 해요.</div>';
    } else {
      html += '<div class="ph-tip">이 단어는 아직 파닉스 설명이 없어요. 🔊로 들어 보세요.</div>';
    }
    var et = window.ETYM && window.ETYM[clean.toLowerCase()];
    if (et) html += '<div class="etym"><div class="label">🌱 어원 (단어의 뿌리)</div>' + esc(et) + "</div>";
    html += '<div class="row"><button class="big primary" id="phPlay">🔊 듣기</button><button class="big" id="phSlow">🐢 천천히</button></div>';
    if (fromPhrase) html += '<div class="row"><button class="big" id="phBackPhrase">◀ ' + esc(fromPhrase) + ' 전체 보기</button></div>';
    $("phBody").innerHTML = html;
    if (fromPhrase) $("phBackPhrase").onclick = function () { showPhrase(fromPhrase); };
    $("phPlay").onclick = function () { TE.speak(clean); };
    $("phSlow").onclick = function () { TE.speak(clean, true); };
    Array.prototype.forEach.call($("phBody").querySelectorAll(".ph-chunk"), function (c) {
      c.onclick = function () { TE.speak(clean, true); };
    });
    $("phModal").classList.remove("hidden");
    TE.speak(clean);
  }
  $("phClose").onclick = function () { $("phModal").classList.add("hidden"); };
  $("phModal").onclick = function (e) { if (e.target === $("phModal")) $("phModal").classList.add("hidden"); };

  // ---------- 문장 해설 ----------
  // ---------- 숙어·표현 ----------
  function idmRe(i) { if (!i._re) i._re = new RegExp(i.re || i.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"); return i._re; }
  function idiomsIn(en) { var out = []; (window.IDIOMS || []).forEach(function (i, n) { if (idmRe(i).test(en)) out.push(n); }); return out; }
  function idmChips(en) {
    var ns = idiomsIn(en || "");
    if (!ns.length) return "";
    return '<div class="idm-row"><span class="lbl">📌 숙어·표현</span>' + ns.map(function (n) {
      var i = IDIOMS[n]; return '<button class="idm-chip" data-idm="' + n + '">' + esc(i.en) + "<small>" + esc(i.ko.split(/[,(/]/)[0].trim()) + "</small></button>";
    }).join("") + "</div>";
  }
  function exampleList() {
    var m = {}, list = [];
    function add(en, ko) { if (!en || m[en.toLowerCase()]) return; m[en.toLowerCase()] = 1; list.push({ en: en, ko: ko || "" }); }
    (window.PRESET_SENTENCES || []).forEach(function (x) { add(x.en, x.ko); });
    if (window.STORY) window.STORY.episodes.forEach(function (ep) { ep.lines.forEach(function (l) { add(l.en, l.ko); }); });
    if (TE.allSentences) TE.allSentences().forEach(function (x) { add(x.en, x.ko); });
    return list;
  }
  function showIdiom(n) {
    var i = IDIOMS[n]; if (!i) return;
    var ex = exampleList().filter(function (x) { return idmRe(i).test(x.en); }).slice(0, 6);
    var sayable = i.en.indexOf("~") < 0;
    var html = '<div class="ph-word" style="font-size:26px">' + esc(i.en) + '</div><div class="ko" style="text-align:center">' + esc(i.ko) + ' <span class="tag">' + (i.kind === "틀" ? "문장 틀" : "숙어") + "</span></div>";
    if (i.tip) html += '<div class="ph-tip">💡 ' + esc(i.tip) + "</div>";
    html += '<div class="label" style="margin-top:10px">앱에 나온 예문 (누르면 소리)</div>';
    html += ex.length ? ex.map(function (x) {
      return '<div class="idm-ex" data-say="' + esc(x.en) + '"><div class="txt"><div class="e">' + esc(x.en) + '</div><div class="k small">' + esc(x.ko) + "</div></div><span>🔊</span></div>";
    }).join("") : '<div class="small">아직 앱 문장에는 없어요. 위 💡 예시를 참고하세요.</div>';
    if (sayable) html += '<div class="row"><button class="big primary" id="phPlay">🔊 듣기</button><button class="big" id="phSlow">🐢 천천히</button></div>';
    $("phBody").innerHTML = html;
    var say = i.en.split(" / ")[0];
    if (sayable) { $("phPlay").onclick = function () { TE.speak(say); }; $("phSlow").onclick = function () { TE.speak(say, true); }; }
    Array.prototype.forEach.call($("phBody").querySelectorAll(".idm-ex"), function (r) { r.onclick = function () { TE.speak(r.dataset.say); }; });
    $("phModal").classList.remove("hidden");
    if (sayable) TE.speak(say);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-idm]");
    if (b) { e.stopPropagation(); showIdiom(+b.dataset.idm); }
  });
  // 문장 공부 창 (달력 등에서 다시 보기). 연습만 하고 기록은 바꾸지 않음
  function showStudy(en, ko, title) {
    if (TE.cancelListen) TE.cancelListen();
    $("stTitle").textContent = title || "💬 문장 다시 보기";
    $("stEn").textContent = en;
    $("stKo").textContent = ko || "";
    $("stResult").innerHTML = "";
    decorate($("stEn"), $("stExp"));
    $("stListen").onclick = function () { TE.speak(en); };
    $("stSlow").onclick = function () { TE.speak(en, true); };
    $("stMic").onclick = function () { TE.listen($("stMic"), en, $("stResult")); };
    $("stModal").classList.remove("hidden");
    TE.speak(en);
  }
  TE.showStudy = showStudy;
  TE.showIdiom = showIdiom; TE.idiomsIn = idiomsIn; TE.idmChips = idmChips;

  // ---------- 연음 ----------
  function linksIn(en) {
    var low = en.toLowerCase(), used = [], out = [];
    (window.LINKS || []).forEach(function (L) {
      if (!L._re) L._re = new RegExp("(^|[^a-z'])(" + L.re.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![a-z'])", "gi");
      L._re.lastIndex = 0; var m;
      while ((m = L._re.exec(low))) {
        var a = m.index + m[1].length, b = a + m[2].length;
        if (!used.some(function (u) { return a < u[1] && b > u[0]; })) { used.push([a, b]); out.push({ a: a, b: b, L: L, text: en.slice(a, b) }); }
      }
    });
    return out.sort(function (x, y) { return x.a - y.a; });
  }
  function linkHtml(en) {
    var ls = linksIn(en || "");
    if (!ls.length) return "";
    var marked = "", pos = 0;
    ls.forEach(function (x) { marked += esc(en.slice(pos, x.a)) + '<span class="lk">' + esc(x.text).replace(/ /g, "‿") + "</span>"; pos = x.b; });
    marked += esc(en.slice(pos));
    var types = {};
    var rows = ls.map(function (x, i) {
      var T = window.LINK_TYPES[x.L.t]; types[x.L.t] = T;
      return '<div class="lk-row" data-lk="' + esc(x.text) + '"><b>' + esc(x.text) + '</b> → <span class="lk-k">' + esc(x.L.k) + '</span> <span class="tag">' + esc(T.name) + "</span> 🔊</div>";
    }).join("");
    var tips = Object.keys(types).map(function (k) { return "<div>• <b>" + esc(types[k].name) + ":</b> " + esc(types[k].tip) + "</div>"; }).join("");
    return '<details class="exp lk-box"><summary>🔗 이어 읽으면 소리가 바뀌어요 (연음 ' + ls.length + '곳)</summary>' +
      '<div class="lk-line">' + marked + "</div>" + rows +
      '<div class="row"><button class="lk-words" data-en="' + esc(en) + '">🐢 한 단어씩</button><button class="lk-nat" data-en="' + esc(en) + '">🔗 이어서</button></div>' +
      '<div class="small">' + tips + '<div style="margin-top:4px">한글은 비슷한 소리예요. 천천히 또박또박 말해도 다 알아들어요!</div></div></details>';
  }
  // 한 단어씩 끊어서 읽기 (이어 읽기와 비교용)
  function speakWords(en) {
    var synth = window.speechSynthesis; if (!synth) return;
    synth.cancel();
    var vs = synth.getVoices().filter(function (v) { return /^en[-_]/i.test(v.lang); });
    var v = vs.filter(function (x) { return x.name === TE.state.voice; })[0] || vs.filter(function (x) { return /en[-_]US/i.test(x.lang); })[0] || vs[0];
    setTimeout(function () {
      en.replace(/[^A-Za-z0-9' -]/g, " ").split(/\s+/).filter(Boolean).forEach(function (w) {
        var u = new SpeechSynthesisUtterance(w); u.lang = "en-US"; if (v) { u.voice = v; u.lang = v.lang; } u.rate = 0.75; synth.speak(u);
      });
    }, 120);
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest(".lk-row,.lk-words,.lk-nat");
    if (!t) return;
    e.stopPropagation();
    if (t.classList.contains("lk-row")) TE.speak(t.dataset.lk);
    else if (t.classList.contains("lk-words")) speakWords(t.dataset.en);
    else TE.speak(t.dataset.en);
  });
  TE.linksIn = linksIn; TE.linkHtml = linkHtml;

  function explainHtml(en) {
    var x = (window.EXPLAIN || {})[en];
    if (!x) return idmChips(en) + linkHtml(en);
    var parts = x.p.split(" / ").map(function (p) {
      var k = p.indexOf("=");
      return "<span><b>" + esc(p.slice(0, k)) + "</b>" + esc(p.slice(k + 1)) + "</span>";
    }).join("");
    return idmChips(en) + '<details class="exp"><summary>💡 왜 이런 뜻일까? (해설 보기)</summary><div class="parts">' + parts + '</div><div class="why">' + esc(x.e) + "</div></details>" + linkHtml(en);
  }

  // 문장 속 단어를 누를 수 있게 바꾸기
  function decorate(el, expEl) {
    if (!el) return;
    var text = el.textContent;
    el.innerHTML = text.split(/(\s+)/).map(function (part) {
      if (!part.trim()) return part;
      return '<span class="w-tap" data-w="' + esc(part) + '">' + esc(part) + "</span>";
    }).join("");
    Array.prototype.forEach.call(el.querySelectorAll(".w-tap"), function (s) {
      s.onclick = function () { showPhonics(s.dataset.w); };
    });
    if (expEl) expEl.innerHTML = '<div class="tap-hint">👆 밑줄 단어를 누르면 발음(파닉스)이 나와요</div>' + explainHtml(text);
  }

  TE.decorate = decorate;
  TE.showPhonics = showPhonics;
  TE.explainHtml = explainHtml;
  TE.lookupPhonics = lookup;

  // 처음 화면 꾸미기 (app.js가 먼저 그려 놓은 문장)
  ["todayEn", "pEn"].forEach(function (id) {
    var el = $(id);
    if (el.querySelector(".w-tap")) return;
    decorate(el, $(id === "todayEn" ? "todayExp" : "pExp"));
  });
})();

// ---------- 팝업 공통: 아래 닫기 버튼, 바깥 누르기, 폰 뒤로가기 ----------
(function () {
  var $ = window.TE.$;
  var IDS = ["phModal", "stModal", "dayModal", "stampModal", "srModal"];
  function isOpen(id) { var m = $(id); return m && !m.classList.contains("hidden"); }
  function closeAll() { IDS.forEach(function (id) { var m = $(id); if (m && !m.classList.contains("hidden")) { var c = id === "stampModal" ? $("stampClose") : null; if (c) c.click(); else m.classList.add("hidden"); } }); }
  Array.prototype.forEach.call(document.querySelectorAll("[data-close]"), function (b) {
    b.onclick = function () { $(b.dataset.close).classList.add("hidden"); };
  });
  // 팝업이 열리면 뒤로가기 기록을 하나 넣어서, 폰 뒤로가기 버튼으로 닫히게 함
  // 겹쳐 열린 순서를 기억해서, 뒤로가기는 맨 위 팝업만 닫음
  var stack = [];
  function hide(id) { var c = id === "stampModal" ? $("stampClose") : null; if (c) c.click(); else $(id).classList.add("hidden"); }
  IDS.forEach(function (id) {
    var m = $(id); if (!m) return;
    var was = isOpen(id);
    new MutationObserver(function () {
      var now = isOpen(id);
      if (now && !was) { stack.push(id); try { history.pushState({ modal: id }, ""); } catch (e) {} }
      if (!now && was) {
        var i = stack.lastIndexOf(id); if (i >= 0) stack.splice(i, 1);
        if (history.state && history.state.modal === id) { try { history.back(); } catch (e) {} }
      }
      was = now;
    }).observe(m, { attributes: true, attributeFilter: ["class"] });
  });
  window.addEventListener("popstate", function () {
    var keep = history.state && history.state.modal;
    while (stack.length && stack[stack.length - 1] !== keep) { var top = stack.pop(); if (isOpen(top)) hide(top); }
  });
})();

// ---------- 앱 버전 / 업데이트 ----------
(function () {
  var TE = window.TE, $ = TE.$;
  $("appVer").textContent = "버전 " + TE.version;
  $("updBtn").onclick = function () {
    $("updMsg").textContent = "새 버전을 확인하는 중…";
    var go = function () { location.reload(); };
    if (TE.swReg) TE.swReg.update().then(function () { setTimeout(go, 800); }, go); else go();
  };
})();

// ---------- 🔍 영어로 뭐예요? (앱 안 단어·문장에서 찾기) ----------
(function () {
  var TE = window.TE, $ = TE.$, esc = TE.esc;
  function items() {
    var list = [], seen = {};
    (window.WORDS || []).forEach(function (w) {
      var k = w.en.toLowerCase(); if (seen[k]) return; seen[k] = 1;
      list.push({ en: w.en, ko: w.ko, kind: "단어", ex: w.ex, exko: w.exko });
    });
    TE.allSentences().forEach(function (s) {
      var k = s.en.toLowerCase(); if (seen[k]) return; seen[k] = 1;
      list.push({ en: s.en, ko: s.ko, kind: "문장" });
    });
    return list;
  }
  function hl(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0 || !q) return esc(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
  }
  var mode = "find";
  function setMode(m) {
    mode = m;
    Array.prototype.forEach.call($("srSeg").querySelectorAll("button"), function (b) { b.classList.toggle("on", b.dataset.m === m); });
    $("srInput").placeholder = m === "idm" ? "숙어 거르기 (예: 카드, get)" : "한국어나 영어로 찾기 (예: 통로, 화장실)";
    search();
  }
  function idmList(q) {
    var ql = q.toLowerCase(), body = $("srBody"), html = "";
    ["숙어", "틀"].forEach(function (k) {
      var rows = [];
      IDIOMS.forEach(function (i, n) {
        if (i.kind !== k) return;
        if (q && i.ko.indexOf(q) < 0 && i.en.toLowerCase().indexOf(ql) < 0) return;
        rows.push('<div class="idm-li" data-idm="' + n + '"><b>' + hl(i.en, q) + "</b> " + hl(i.ko, q) + "</div>");
      });
      if (rows.length) html += '<div class="idm-h">' + (k === "숙어" ? "📌 숙어 (묶어서 외우는 말)" : "🧩 문장 틀 (단어만 바꿔 쓰기)") + " " + rows.length + "개</div>" + rows.join("");
    });
    body.innerHTML = html || '<div class="result info">맞는 숙어가 없어요.</div>';
  }
  function search() {
    var q = $("srInput").value.trim();
    var body = $("srBody");
    if (mode === "idm") { idmList(q); return; }
    if (!q) { body.innerHTML = '<div class="small" style="margin-top:8px">앱에 들어 있는 단어 ' + (window.WORDS || []).length + '개와 문장에서 찾아요. 결과를 누르면 발음(파닉스)과 어원이 나와요.</div>'; return; }
    var ql = q.toLowerCase();
    var res = items().filter(function (x) { return x.ko.indexOf(q) >= 0 || x.en.toLowerCase().indexOf(ql) >= 0 || (x.exko && x.exko.indexOf(q) >= 0); });
    function rank(x) { var r = x.kind === "단어" ? 0 : 2; if (x.ko.indexOf(q) < 0 && x.en.toLowerCase().indexOf(ql) < 0) r += 3; if (x.ko === q || x.en.toLowerCase() === ql) r -= 1; return r; }
    res.sort(function (a, b) { return rank(a) - rank(b); });
    res = res.slice(0, 20);
    var html = res.map(function (x, n) {
      var exLine = x.kind === "단어" && x.ko.indexOf(q) < 0 && x.exko && x.exko.indexOf(q) >= 0 ? '<div class="k">예문: ' + hl(x.exko, q) + "</div>" : "";
      return '<div class="list-item" data-n="' + n + '"><div class="txt"><div class="e">' + hl(x.en, q) + ' <span class="tag">' + x.kind + '</span></div><div class="k">' + hl(x.ko, q) + "</div>" + exLine +
        '</div><button data-say="' + esc(x.en) + '">🔊</button></div>';
    }).join("");
    var idHits = [];
    (window.IDIOMS || []).forEach(function (i, n) { if (i.ko.indexOf(q) >= 0 || i.en.toLowerCase().indexOf(ql) >= 0) idHits.push('<div class="list-item" data-idm="' + n + '"><div class="txt"><div class="e">' + hl(i.en, q) + ' <span class="tag">' + (i.kind === "틀" ? "문장 틀" : "숙어") + '</span></div><div class="k">' + hl(i.ko, q) + "</div></div></div>"); });
    html = idHits.slice(0, 5).join("") + html;
    if (!res.length && !idHits.length) html = '<div class="result info">앱 단어장에는 아직 없는 말이에요.</div>';
    var enc = encodeURIComponent(q);
    html += '<div class="small" style="margin-top:10px">앱에 없는 말은 사전에서 찾아보세요 (인터넷 창이 열려요):</div>' +
      '<div class="row"><a class="big ext" target="_blank" rel="noopener" href="https://en.dict.naver.com/#/search?query=' + enc + '">네이버 영어사전</a>' +
      '<a class="big ext" target="_blank" rel="noopener" href="https://translate.google.com/?sl=ko&tl=en&text=' + enc + '">구글 번역</a></div>';
    body.innerHTML = html;
    Array.prototype.forEach.call(body.querySelectorAll("[data-say]"), function (b) {
      b.onclick = function (e) { e.stopPropagation(); TE.speak(b.dataset.say); };
    });
    Array.prototype.forEach.call(body.querySelectorAll(".list-item[data-n]"), function (row) {
      row.onclick = function () {
        var x = res[+row.dataset.n];
        if (x.kind === "단어") { TE.showPhonics(x.en); return; }
        // 여러 단어면 단어별로 눌러 볼 수 있게 보여 주기
        $("phBody").innerHTML = '<div class="ph-word" style="font-size:24px" id="phSent"></div><div class="ko" style="text-align:center">' + esc(x.ko) + "</div>" +
          '<div class="small" style="text-align:center;margin-top:6px">👆 단어를 누르면 발음과 어원이 나와요</div>' +
          (TE.explainHtml ? TE.explainHtml(x.en) : "") +
          '<div class="row"><button class="big primary" id="phPlay">🔊 듣기</button><button class="big" id="phSlow">🐢 천천히</button></div>';
        $("phSent").textContent = x.en;
        TE.decorate($("phSent"), null);
        $("phPlay").onclick = function () { TE.speak(x.en); };
        $("phSlow").onclick = function () { TE.speak(x.en, true); };
        $("phModal").classList.remove("hidden");
        TE.speak(x.en);
      };
    });
  }
  Array.prototype.forEach.call($("srSeg").querySelectorAll("button"), function (b) { b.onclick = function () { setMode(b.dataset.m); }; });
  if ($("idmOpen")) $("idmOpen").onclick = function () { $("srInput").value = ""; $("srModal").classList.remove("hidden"); setMode("idm"); };
  $("srOpen").onclick = function () { $("srModal").classList.remove("hidden"); setMode("find"); setTimeout(function () { $("srInput").focus(); }, 50); };
  $("srClose").onclick = function () { $("srModal").classList.add("hidden"); };
  $("srModal").onclick = function (e) { if (e.target === $("srModal")) $("srModal").classList.add("hidden"); };
  $("srInput").oninput = search;
})();
