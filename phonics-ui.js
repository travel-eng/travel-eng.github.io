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
      chunks: f[3].split(" ").map(function (c) { var k = c.indexOf("="); return { l: c.slice(0, k), s: c.slice(k + 1) }; })
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
  function showPhonics(word) {
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
    $("phBody").innerHTML = html;
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
  function explainHtml(en) {
    var x = (window.EXPLAIN || {})[en];
    if (!x) return "";
    var parts = x.p.split(" / ").map(function (p) {
      var k = p.indexOf("=");
      return "<span><b>" + esc(p.slice(0, k)) + "</b>" + esc(p.slice(k + 1)) + "</span>";
    }).join("");
    return '<details class="exp"><summary>💡 왜 이런 뜻일까? (해설 보기)</summary><div class="parts">' + parts + '</div><div class="why">' + esc(x.e) + "</div></details>";
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
