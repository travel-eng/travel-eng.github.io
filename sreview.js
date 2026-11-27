// 🧠 문장 복습 카드: 배운 문장을 시간 간격을 두고 다시 꺼내 보기 (단어 복습과 같은 1·3·7·14·30일)
// 한국어 뜻을 보고 → 영어로 말해 보고 → 정답 확인 → 나눠 듣기 → 스스로 평가
(function () {
  var TE = window.TE, $ = TE.$, esc = TE.esc, state = TE.state;
  var INTERVALS = [1, 3, 7, 14, 30], PER_DAY = 5;
  if (!state.sRev) state.sRev = {};

  function today() { return TE.dateKey(); }
  function addDays(key, n) { var p = key.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + n); return TE.dateKey(d); }

  // 이미 배운 문장(외웠어요·따라 말하기 성공·이야기)을 복습 목록에 넣기 (처음 한 번)
  (function migrate() {
    var ok = state.sentOk || {}, ch = false;
    Object.keys(ok).forEach(function (id) {
      if (!state.sRev[id] && TE.byId(id)) {
        // 배운 지 하루가 지난 문장은 바로 복습 대상, 오늘 배운 건 내일부터
        state.sRev[id] = { box: 0, due: ok[id] < today() ? today() : addDays(today(), 1) }; ch = true;
      }
    });
    if (ch) TE.save();
  })();

  // 새로 배운 문장은 내일 처음 복습
  var orig = TE.logSentence;
  TE.logSentence = function (id) {
    if (orig) orig(id);
    if (id && !state.sRev[id] && TE.byId(id)) { state.sRev[id] = { box: 0, due: addDays(today(), 1) }; TE.save(); }
  };

  function dueIds() {
    var t = today();
    return Object.keys(state.sRev).filter(function (id) { return state.sRev[id].due <= t && TE.byId(id); })
      .sort(function (a, b) { return state.sRev[a].due < state.sRev[b].due ? -1 : state.sRev[a].due > state.sRev[b].due ? 1 : 0; });
  }
  // 오늘의 카드 (하루 최대 5장, 그날 안에서는 고정)
  function todaySet() {
    var t = today();
    if (state.srToday && state.srToday.date === t && state.srToday.ids.length) return state.srToday;
    var ids = dueIds().slice(0, PER_DAY);
    state.srToday = { date: t, ids: ids, pos: 0, ok: 0 };
    TE.save();
    return state.srToday;
  }
  TE.sentDue = function () { var s = todaySet(); return s.ids.length - s.pos > 0 ? s.ids.length : 0; };
  TE.sentTodayLabel = function () { var s = todaySet(); return s.ids.length ? " (" + Math.min(s.pos, s.ids.length) + "/" + s.ids.length + ")" : ""; };

  var C = null; // 지금 카드 상태 { shown, heard }
  var buildTimer = null;

  function render() {
    var S = todaySet(), box = $("srevMain");
    var top = '<div class="subhead"><button class="back" data-back2="todo">◀ 할 일</button><div class="label" style="margin:0">🧠 문장 복습 카드</div></div>';
    if (!S.ids.length) {
      box.innerHTML = top + '<div class="result info">오늘 복습할 문장이 없어요. 문장을 외우면(✔ 외웠어요, 따라 말하기 성공, 이야기) 다음 날부터 여기 나와요.</div>' + plan();
      bindTop(); return;
    }
    if (S.pos >= S.ids.length) {
      box.innerHTML = top + '<div style="text-align:center"><div style="font-size:40px">🧠</div><div class="en">오늘 복습 끝!</div>' +
        '<div class="ko">바로 기억난 문장: ' + S.ok + " / " + S.ids.length + "</div>" +
        '<div class="small">헷갈린 문장은 내일 다시, 기억난 문장은 점점 더 긴 간격으로 다시 나와요.</div></div>' + plan() +
        '<div class="row"><button class="big primary" data-back2="todo">할 일로 ▶</button></div>';
      bindTop(); return;
    }
    var id = S.ids[S.pos], sen = TE.byId(id), R = state.sRev[id];
    if (!C || C.id !== id) C = { id: id, shown: false, heard: null };
    var dots = '<div class="sr-dots">' + S.ids.map(function (x, k) { return '<i class="' + (k < S.pos ? "on" : "") + '"></i>'; }).join("") + "</div>";
    var first = sen.en.split(" ").slice(0, 2).join(" ");
    var html = top + dots +
      '<div class="small">' + (S.pos + 1) + " / " + S.ids.length + " · 이 뜻을 영어로 말해 보세요" + (R.box ? " · " + R.box + "번째 복습" : "") + "</div>" +
      '<div class="sr-ko">' + esc(sen.ko) + "</div>";
    if (!C.shown) {
      html += '<div class="sr-hint" id="srHint"></div>' +
        '<div class="row"><button class="big mic primary" id="srMic">🎤 말해 보기</button></div>' +
        '<div class="row"><button id="srHintB">💡 첫 단어</button><button id="srShow">👀 정답 보기</button></div><div id="srRes"></div>';
    } else {
      html += '<div class="en" id="srEn"></div><div id="srExp"></div>' +
        '<div class="row"><button id="srPlay">🔊 듣기</button><button id="srSlow">🐢 천천히</button><button id="srBuild">🧩 나눠 듣기</button></div>' +
        '<div class="small" style="margin-top:2px">🧩 나눠 듣기: 앞부분부터 조금씩 늘려 가며 들려줘요. 따라 말하면 긴 문장도 쉽게 외워져요.</div>' +
        '<div id="srRes">' + (C.heard ? C.heard : "") + "</div>" +
        '<div class="label" style="margin-top:8px">기억났나요?</div>' +
        '<div class="row"><button class="big" id="srBad">😅 헷갈렸어요<br><span class="small">내일 다시</span></button><button class="big primary" id="srGood">😊 기억났어요<br><span class="small">' + INTERVALS[Math.min(R.box + 1, INTERVALS.length - 1)] + "일 뒤에</span></button></div>";
    }
    $("srevMain").innerHTML = html;
    bindTop();
    if (!C.shown) {
      $("srHintB").onclick = function () { $("srHint").textContent = "💡 " + first + " …"; };
      $("srShow").onclick = function () { reveal(); };
      $("srMic").onclick = function () {
        TE.listen($("srMic"), sen.en, $("srRes"), function (ok) {
          C.heard = $("srRes").innerHTML; C.ok = ok;
          setTimeout(reveal, ok ? 600 : 1200);
        });
      };
    } else {
      $("srEn").textContent = sen.en;
      if (TE.decorate) TE.decorate($("srEn"), $("srExp"));
      $("srPlay").onclick = function () { TE.speak(sen.en); };
      $("srSlow").onclick = function () { TE.speak(sen.en, true); };
      $("srBuild").onclick = function () { buildUp(sen.en); };
      $("srGood").onclick = function () { rate(true); };
      $("srBad").onclick = function () { rate(false); };
    }
  }
  function reveal() { C.shown = true; render(); TE.speak(TE.byId(C.id).en); }

  // 앞에서부터 조금씩 늘려 가며 읽기: "Could you" → "Could you let me know" → 전체
  function buildUp(en) {
    var synth = window.speechSynthesis; if (!synth) { TE.speak(en); return; }
    var w = en.split(/\s+/), parts = [], step = w.length <= 4 ? 2 : 3;
    for (var n = step; n < w.length; n += step) parts.push(w.slice(0, n).join(" ").replace(/[,.!?]$/, ""));
    parts.push(en);
    synth.cancel();
    var vs = synth.getVoices().filter(function (v) { return /^en[-_]/i.test(v.lang); });
    var v = vs.filter(function (x) { return x.name === state.voice; })[0] || vs.filter(function (x) { return /en[-_]US/i.test(x.lang); })[0] || vs[0];
    setTimeout(function () {
      parts.forEach(function (p, k) {
        var u = new SpeechSynthesisUtterance(p); u.lang = "en-US"; if (v) { u.voice = v; u.lang = v.lang; }
        u.rate = k === parts.length - 1 ? 0.9 : 0.75; synth.speak(u);
      });
    }, 120);
  }

  function rate(good) {
    var S = todaySet(), id = S.ids[S.pos], R = state.sRev[id];
    if (good) { R.box = Math.min(R.box + 1, INTERVALS.length - 1); R.due = addDays(today(), INTERVALS[R.box]); S.ok++; }
    else { R.box = 0; R.due = addDays(today(), 1); }
    S.pos++; C = null;
    if (S.pos >= S.ids.length) {
      var r = state.cal[today()] = state.cal[today()] || {};
      r.sr = true;
      if (TE.addLog) TE.addLog("srev", S.ids);
    }
    TE.save();
    render();
    if (S.pos >= S.ids.length && TE.checkDay) TE.checkDay();
  }

  function plan() {
    var n = Object.keys(state.sRev).length; if (!n) return "";
    var soon = Object.keys(state.sRev).filter(function (id) { return state.sRev[id].due <= addDays(today(), 1); }).length;
    var strong = Object.keys(state.sRev).filter(function (id) { return state.sRev[id].box >= 3; }).length;
    return '<div class="small" style="margin-top:10px">📚 복습 중인 문장 ' + n + "개 · 내일까지 " + soon + "개 · 오래 기억하는 문장(2주 이상) " + strong + "개</div>";
  }
  function bindTop() {
    Array.prototype.forEach.call($("srevMain").querySelectorAll("[data-back2]"), function (b) { b.onclick = function () { TE.showTab(b.dataset.back2); }; });
  }

  TE.renderSRev = render;
  if (TE.renderTodo) TE.renderTodo();
})();
