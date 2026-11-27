(function () {
  "use strict";
  var TE = window.TE, state = TE.state, $ = TE.$, esc = TE.esc;
  var S = window.STORY, EPS = S.episodes, WORDS = window.WORDS;
  state.story = state.story || { done: {} };

  function today() { return TE.dateKey(); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function box(html) { $("storyMain").innerHTML = html; window.scrollTo(0, 0); }
  function doneCount() { return Object.keys(state.story.done).length; }

  // 다음에 할 화 번호. 하루에 1화씩 열림.
  function nextEp() { for (var i = 0; i < EPS.length; i++) if (!state.story.done[i]) return i; return -1; }
  function unlocked(i) {
    if (state.story.done[i]) return true;
    if (i !== nextEp()) return false;
    if (i === 0) return true;
    return state.story.done[i - 1] < today();
  }
  // 오늘 새로 할 수 있는 화 (-1: 없음)
  TE.storyAvailable = function () { var n = nextEp(); return n >= 0 && unlocked(n) ? n : -1; };

  // ---------- 여러 여행지 ----------
  var TRIPS = S.trips || [{ city: S.city, country: S.country, flag: S.flag, stamp: "SYDNEY", from: 0, to: EPS.length - 1 }];
  function tripOf(i) { for (var t = 0; t < TRIPS.length; t++) if (i >= TRIPS[t].from && i <= TRIPS[t].to) return TRIPS[t]; return TRIPS[0]; }
  function num(i) { return i - tripOf(i).from + 1; }
  function tripDone(T) { for (var i = T.from; i <= T.to; i++) if (!state.story.done[i]) return false; return true; }
  function curTrip() { var n = nextEp(); return n >= 0 ? tripOf(n) : TRIPS[TRIPS.length - 1]; }
  TE.storyTripName = function () { var T = curTrip(); return T.flag + " " + T.city + " 여행"; };
  TE.storyLabel = function (i) { var ep = EPS[i]; return ep ? tripOf(i).flag + " " + tripOf(i).city + " " + num(i) + "화 " + ep.icon + " " + ep.title : ""; };
  var viewT = null;

  // ---------- 여행 지도 ----------
  function home() {
    var n = nextEp(), T = curTrip();
    var V = viewT || T;
    var tot = V.to - V.from + 1, dc = 0;
    for (var i = V.from; i <= V.to; i++) if (state.story.done[i]) dc++;
    var html = "";
    if (TRIPS.length > 1) html += '<div class="seg mini" id="tripSeg">' + TRIPS.map(function (t, k) {
      var open = t.from <= (n < 0 ? EPS.length : n);
      return '<button data-t="' + k + '" class="' + (t === V ? "on" : "") + '">' + (tripDone(t) ? "✅ " : open ? "" : "🔒 ") + t.flag + " " + esc(t.city) + "</button>";
    }).join("") + "</div>";
    html += '<div class="card"><div class="label">' + V.flag + " " + V.country + " " + V.city + " 여행 · " + dc + "/" + tot + "화</div>" +
      '<div class="progress"><i style="width:' + (dc / tot * 100) + '%"></i></div>';
    if (V === T) {
      if (n >= 0 && unlocked(n)) {
        html += '<div class="en">' + EPS[n].icon + " " + num(n) + "화 " + esc(EPS[n].title) + '</div><div class="row"><button class="big primary" data-ep="' + n + '">▶ 오늘의 이야기 시작</button></div>';
      } else if (n >= 0) {
        html += '<div class="result info">🌙 다음 이야기 <b>' + (n === T.from ? T.city + " 여행 1화" : num(n) + "화") + "</b>는 <b>내일</b> 열려요. 두근두근!</div>" +
          '<div class="ko" style="margin-top:8px">지난 이야기: ' + esc(EPS[n - 1].teaser) + "</div>";
      } else {
        html += '<div class="result ok">🎉 모든 여행 완주! 여권에 도장이 찍혔어요.</div>';
      }
    } else if (tripDone(V)) {
      html += '<div class="result ok">🎉 ' + V.city + " 여행 완주! 다시 보고 싶은 화를 눌러요.</div>";
    } else {
      html += '<div class="result info">앞 여행을 마치면 ' + V.city + " 여행이 열려요.</div>";
    }
    html += "</div>";
    var rows = [];
    for (var j = V.from; j <= V.to; j++) (function (i) {
      var ep = EPS[i];
      var st = state.story.done[i] ? "✅" : unlocked(i) ? "🔓" : "🔒";
      var can = state.story.done[i] || unlocked(i);
      rows.push('<div class="list-item"><div class="txt"><div class="e">' + st + " " + num(i) + "화 " + ep.icon + " " + esc(ep.title) + "</div>" +
        (state.story.done[i] ? '<div class="k">' + esc(state.story.done[i]) + " 완료</div>" : (can ? "" : '<div class="k">' + (i === n ? "내일 열려요" : "앞 이야기를 먼저 해요") + "</div>")) +
        "</div>" + (can ? '<button data-ep="' + i + '">' + (state.story.done[i] ? "다시 보기" : "시작") + "</button>" : "") + "</div>");
    })(j);
    html += '<div class="card"><div class="label">🗺️ 여행 일정</div>' + rows.join("") + "</div>";
    html += passportHtml();
    box(html);
    Array.prototype.forEach.call($("storyMain").querySelectorAll("[data-ep]"), function (b) {
      b.onclick = function () { startEp(+b.dataset.ep); };
    });
    Array.prototype.forEach.call($("storyMain").querySelectorAll("#tripSeg [data-t]"), function (b) {
      b.onclick = function () { viewT = TRIPS[+b.dataset.t]; home(); };
    });
  }
  function passportHtml() {
    return '<div class="card passport"><div class="label">🛂 내 여권</div><div class="pp-stamps">' + TRIPS.map(function (T) {
      var full = tripDone(T);
      return '<div class="pp-stamp' + (full ? " on" : "") + '"><b>' + esc(T.stamp) + "</b><span>" + T.flag + " " + esc(T.city) + "</span><small>" + (full ? esc(state.story.done[T.to]) : "여행 중") + "</small></div>";
    }).join("") +
      '<div class="pp-stamp empty"><b>?</b><span>다음 여행지</span><small>' + (tripDone(TRIPS[TRIPS.length - 1]) ? "같이 정해요" : "") + "</small></div>" +
      "</div></div>";
  }

  // ---------- 한 화 진행 ----------
  var E = null; // { i, ep, step, line, quiz }
  function startEp(i) {
    E = { i: i, ep: EPS[i], step: 0, line: 0, shown: [] };
    renderIntro();
  }
  function stepsBar() {
    return '<div class="steps">' + ["① 이야기", "② 대화", "③ 미션"].map(function (n, k) {
      return '<span class="' + (k < E.step ? "done" : k === E.step ? "on" : "") + '">' + n + "</span>";
    }).join("") + "</div>";
  }
  function head() { var T = tripOf(E.i); return '<div class="label">' + T.flag + " " + T.city + " " + num(E.i) + "화 · " + esc(E.ep.title) + "</div>" + stepsBar(); }

  function renderIntro() {
    var ep = E.ep;
    box('<div class="card">' + head() + '<div class="story-icon">' + ep.icon + "</div>" +
      '<div class="story-text">' + esc(ep.intro) + "</div>" +
      '<div class="label" style="margin-top:14px">이번 화 핵심 단어 (누르면 발음)</div><div class="chips">' +
      ep.wordIdx.map(function (wi) { var w = WORDS[wi]; return '<button class="chip" data-w="' + esc(w.en) + '"><b>' + esc(w.en) + "</b> " + esc(w.ko) + "</button>"; }).join("") +
      '</div><div class="row"><button class="big" id="sBack">◀ 지도</button><button class="big primary" id="sGo">대화 시작 ▶</button></div></div>');
    Array.prototype.forEach.call($("storyMain").querySelectorAll(".chip"), function (b) {
      b.onclick = function () { if (TE.showPhonics) TE.showPhonics(b.dataset.w); else TE.speak(b.dataset.w); };
    });
    $("sBack").onclick = home;
    $("sGo").onclick = function () { E.step = 1; E.line = 0; renderChat(); };
  }

  // ② 대화: 한 줄씩 진행
  function bubble(l, k) {
    if (l.who === "npc") {
      return '<div class="bub npc"><div class="who">' + esc(l.name) + '</div><div class="en" data-say="' + esc(l.en) + '">' + esc(l.en) +
        '</div><div class="k hidden" id="k' + k + '">' + esc(l.ko) + '</div><div class="bub-btns"><button data-say="' + esc(l.en) + '">🔊</button><button data-slow="' + esc(l.en) + '">🐢</button><button data-ko="' + k + '">뜻</button></div></div>';
    }
    return '<div class="bub me"><div class="who">나</div><div class="en" data-say="' + esc(l.en) + '">' + esc(l.en) + '</div><div class="k">' + esc(l.ko) + "</div></div>";
  }
  function renderChat() {
    var ep = E.ep, lines = ep.lines;
    var html = '<div class="card">' + head() + '<div class="chat">';
    var from = E.showAll ? 0 : Math.max(0, E.line - 1);
    if (from > 0) html += '<button class="old-chat" id="oldChat">⬆ 앞 대화 ' + from + '줄 보기</button>';
    for (var k = from; k < E.line; k++) html += bubble(lines[k], k);
    var cur = lines[E.line];
    if (cur && cur.who === "npc") {
      html += bubble(cur, E.line) + "</div>" + '<div class="row"><button class="big primary" id="cNext">다음 ▶</button></div>';
    } else if (cur && cur.who === "me") {
      var opts = cur.opts || (cur.opts = shuffle([cur.en].concat(cur.wrong)));
      html += '</div><div class="my-turn"><div class="label">내 차례! 이렇게 말하고 싶어요</div><div class="ko-big">"' + esc(cur.ko) + '"</div>' +
        '<div class="choices">' + opts.map(function (o, j) { return '<button data-o="' + j + '">' + esc(o) + "</button>"; }).join("") + '</div><div id="cFb"></div></div>';
    } else {
      html += '</div><div class="row"><button class="big primary" id="toMission">미션 하러 가기 ▶</button></div>';
    }
    html += "</div>";
    box(html);
    // 맨 아래로
    var chat = $("storyMain").querySelector(".chat");
    window.scrollTo(0, 0);
    Array.prototype.forEach.call($("storyMain").querySelectorAll("[data-say]"), function (b) { b.onclick = function () { TE.speak(b.dataset.say); }; });
    Array.prototype.forEach.call($("storyMain").querySelectorAll("[data-slow]"), function (b) { b.onclick = function () { TE.speak(b.dataset.slow, true); }; });
    Array.prototype.forEach.call($("storyMain").querySelectorAll("[data-ko]"), function (b) {
      b.onclick = function () { $("k" + b.dataset.ko).classList.toggle("hidden"); };
    });
    if ($("oldChat")) $("oldChat").onclick = function () { E.showAll = true; renderChat(); };
    if (cur && cur.who === "npc") {
      TE.speak(cur.en);
      $("cNext").onclick = function () { E.line++; E.showAll = false; renderChat(); };
    } else if (cur && cur.who === "me") {
      Array.prototype.forEach.call($("storyMain").querySelectorAll("[data-o]"), function (b) {
        b.onclick = function () {
          var said = cur.opts[+b.dataset.o];
          TE.speak(said);  // 누를 때마다 소리
          if (cur.answered) return;
          if (said !== cur.en) {
            b.classList.add("wrong");
            $("cFb").innerHTML = '<div class="result bad">앗, 그 말은 뜻이 달라요. 다시 골라 보세요!</div>';
            return;
          }
          cur.answered = true;
          b.classList.add("right");
          $("cFb").innerHTML = '<div class="result ok">⭕ 좋아요! 초록 문장을 누를 때마다 소리가 나요.</div>' +
            '<div class="row"><button class="big" id="cPlay">🔊</button><button class="big" id="cSlow">🐢</button><button class="big mic" id="cMic">🎤 말하기</button><button class="big primary" id="cNext2">다음 ▶</button></div><div id="cMicR"></div>';
          $("cPlay").onclick = function () { TE.speak(cur.en); };
          $("cSlow").onclick = function () { TE.speak(cur.en, true); };
          $("cMic").onclick = function () { TE.listen($("cMic"), cur.en, $("cMicR")); };
          $("cNext2").onclick = function () { cur.answered = false; E.line++; E.showAll = false; renderChat(); };
        };
      });
    } else {
      $("toMission").onclick = function () { E.step = 2; startMission(); };
    }
  }

  // ③ 미션: 단어 퀴즈 + 핵심 문장 만들기
  function startMission() {
    var qs = shuffle(E.ep.wordIdx).map(function (wi) { return { kind: "word", i: wi }; });
    qs.push({ kind: "build" });
    E.quiz = { list: qs, pos: 0, right: 0 };
    renderMission();
  }
  function renderMission() {
    var Q = E.quiz, q = Q.list[Q.pos];
    if (!q) return finishMission();
    var top = '<div class="card">' + head() + '<div class="label">미션 ' + (Q.pos + 1) + " / " + Q.list.length + " · 맞힌 개수 " + Q.right + "</div>";
    if (q.kind === "word") {
      var w = WORDS[q.i];
      var pool = shuffle(WORDS.filter(function (x) { return x.en !== w.en; })).slice(0, 3).map(function (x) { return x.en; });
      var opts = q.opts || (q.opts = shuffle(pool.concat([w.en])));
      box(top + '<div class="label">이 뜻의 영어는?</div><div class="word-big">' + esc(w.ko) + '</div><div class="choices">' +
        opts.map(function (o, j) { return '<button data-o="' + j + '">' + esc(o) + "</button>"; }).join("") + '</div><div id="mFb"></div></div>');
      Array.prototype.forEach.call($("storyMain").querySelectorAll("[data-o]"), function (b) {
        b.onclick = function () {
          if (q.done) return; q.done = true;
          var ok = opts[+b.dataset.o] === w.en;
          if (ok) Q.right++;
          Array.prototype.forEach.call($("storyMain").querySelectorAll("[data-o]"), function (x) {
            if (opts[+x.dataset.o] === w.en) x.classList.add("right"); else if (x === b) x.classList.add("wrong");
          });
          TE.speak(w.en);
          next(ok, w.en + " = " + w.ko);
        };
      });
    } else {
      var key = E.ep.key;
      var toks = key.replace(/[.?!,]/g, "").split(/\s+/);
      var tiles = shuffle(toks.map(function (t, k) { return { t: t, k: k }; }));
      var keyLine = E.ep.lines.filter(function (l) { return l.en === key; })[0];
      box(top + '<div class="label">이야기 속 핵심 문장을 만들어 보세요</div><div class="word-big" style="font-size:22px">' + esc(keyLine ? keyLine.ko : "") + "</div>" +
        '<div class="build-line" id="bLine"></div><div class="build-tiles">' +
        tiles.map(function (x) { return '<button class="tile" data-k="' + x.k + '">' + esc(x.t) + "</button>"; }).join("") +
        '</div><div class="row"><button class="big" id="bUndo">↩ 하나 지우기</button></div><div id="mFb"></div></div>');
      var picked = [];
      var draw = function () { $("bLine").textContent = picked.map(function (b) { return b.textContent; }).join(" ") || " "; };
      draw();
      Array.prototype.forEach.call($("storyMain").querySelectorAll(".build-tiles .tile"), function (b) {
        b.onclick = function () {
          if (q.done || b.classList.contains("gone")) return;
          b.classList.add("gone"); picked.push(b); draw();
          if (picked.length === toks.length) {
            q.done = true;
            var said = picked.map(function (x) { return x.textContent; }).join(" ");
            var ok = TE.tokens(said).join(" ") === TE.tokens(key).join(" ");
            if (ok) Q.right++;
            TE.speak(key);
            next(ok, key);
          }
        };
      });
      $("bUndo").onclick = function () { if (q.done) return; var b = picked.pop(); if (b) b.classList.remove("gone"); draw(); };
    }
    function next(ok, ans) {
      $("mFb").innerHTML = '<div class="result ' + (ok ? "ok" : "bad") + '">' + (ok ? "⭕ 정답!" : "❌ 정답: " + esc(ans)) + "</div>" +
        '<div class="row"><button class="big primary" id="mNext">다음 ▶</button></div>';
      $("mNext").onclick = function () { Q.pos++; renderMission(); };
    }
  }
  function finishMission() {
    var Q = E.quiz, n = Q.list.length, pct = Math.round(Q.right / n * 100);
    if (pct < 80) {
      box('<div class="card">' + head() + '<div class="en">😅 ' + Q.right + " / " + n + '</div><div class="ko">80% 이상이면 이번 화 완료예요. 다시 도전해요!</div>' +
        '<div class="row"><button class="big" id="reChat">대화 다시 보기</button><button class="big primary" id="reM">미션 다시</button></div></div>');
      $("reChat").onclick = function () { E.step = 1; E.line = 0; renderChat(); };
      $("reM").onclick = startMission;
      return;
    }
    var first = !state.story.done[E.i];
    var T = tripOf(E.i), last = E.i === T.to;
    if (first) {
      state.story.done[E.i] = today();
      if (TE.learnWords) TE.learnWords(E.ep.wordIdx);
      E.ep.lines.forEach(function (l, k) { if (l.who === "me" && TE.logSentence) TE.logSentence("s" + E.i + "_" + k); });
      if (TE.addLog) { TE.addLog("story", [E.i]); TE.addLog("words", E.ep.wordIdx); }
      TE.save();
    }
    box('<div class="card" style="text-align:center">' + '<div class="story-icon">' + E.ep.icon + "</div>" +
      '<div class="en">🎉 ' + num(E.i) + "화 완료! (" + pct + "%)</div>" +
      (first ? '<div class="ko">핵심 단어 ' + E.ep.wordIdx.length + "개가 단어장과 복습에 들어갔어요.</div>" : "") +
      '<div class="teaser"><div class="label">' + (last ? "에필로그" : "📺 다음 이야기 예고") + "</div>" + esc(E.ep.teaser) + "</div>" +
      (last ? (E.i < EPS.length - 1 ? '<div class="small">✈️ 내일부터 ' + esc(tripOf(E.i + 1).city) + " 여행이 시작돼요!</div>" : "") : '<div class="small">' + (num(E.i) + 1) + "화는 내일 열려요!</div>") +
      '<div class="row"><button class="big primary" id="sHome">여행 지도로</button></div></div>');
    $("sHome").onclick = function () { viewT = null; home(); };
    if (first && TE.checkDay) TE.checkDay();
    if (first && last) showPassportStamp(T);
  }
  function showPassportStamp(T) {
    $("bigStamp").innerHTML = "<span>" + T.stamp + "<br>" + T.flag + "</span>";
    $("stampMsg").textContent = T.city + " 여행 완주! 여권에 도장을 찍었어요 🛂";
    $("stampModal").classList.remove("hidden");
    var close = $("stampClose").onclick;
    $("stampClose").onclick = function () {
      $("bigStamp").innerHTML = "<span>참<br>잘했어요</span>";
      $("stampClose").onclick = close;
      $("stampModal").classList.add("hidden");
    };
  }

  TE.renderStory = function () { if (!E) home(); else if (E.step === 0) renderIntro(); else if (E.step === 1) renderChat(); else renderMission(); };
  TE.storyHome = function () { E = null; viewT = null; home(); };
  TE._s = { E: function () { return E; } };
})();

// ---------- 슝슝이(꼬마 비행기) 한마디 ----------
(function () {
  var TE = window.TE, $ = TE.$;
  var LINES = [
    "슝슝~ 오늘도 같이 떠나 볼까요?", "천천히 해도 괜찮아요 🌱", "틀려도 괜찮아요. 그게 배우는 거예요!",
    "G'day! 호주식 '안녕'이에요 🇦🇺", "한 문장씩, 한 걸음씩 👣", "소리 내어 말하면 더 오래 기억나요 🔊",
    "No worries! 걱정 마요 😊", "Xin chào! 베트남어로 '안녕하세요'예요 🇻🇳", "오늘의 이야기가 기다리고 있어요 📖", "잘하고 있어요. 정말로요! ✨"
  ];
  function say() {
    var st = TE.state, k = TE.dateKey(), r = (st.cal || {})[k] || {};
    var line = r.stamp ? "오늘 할 일 다 했어요! 최고예요 🌟" : LINES[Math.floor(Math.random() * LINES.length)];
    var el = $("mascotSay"); if (el) el.textContent = line;
  }
  var m = $("mascot");
  if (m) m.onclick = function () { say(); m.style.animation = "none"; void m.offsetWidth; m.style.animation = ""; };
  say();
})();
