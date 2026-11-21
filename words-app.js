(function () {
  "use strict";
  var TE = window.TE, state = TE.state, $ = TE.$, esc = TE.esc;
  var WORDS = window.WORDS;

  var BASIC_STAGES = 10, BASIC_PER_DAY = 5;
  var BASIC_COUNT = BASIC_STAGES * BASIC_PER_DAY;    // 기초 50개
  var PASS = 0.8;                                    // 테스트 80% 이상 통과
  var INTERVALS = [1, 3, 7, 14, 30];                 // 복습 간격(일)

  state.wPos = state.wPos || 0;          // 다음에 배울 단어 번호
  state.wStage = state.wStage || 1;      // 다음 단계 번호
  state.wPerDay = state.wPerDay || 5;    // 11단계부터 하루 개수
  state.learned = state.learned || {};   // { 단어번호: { box, due } }
  state.wToday = state.wToday || null;   // { date, stage, idx:[], step, passed }
  state.cal = state.cal || {};           // { 날짜: { w, r, needR, stamp } }
  TE.save();

  // ---------- 날짜 ----------
  function today() { return TE.dateKey(); }
  function addDays(key, n) {
    var p = key.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]);
    d.setDate(d.getDate() + n);
    return TE.dateKey(d);
  }
  function dayRec(key) {
    key = key || today();
    if (!state.cal[key]) state.cal[key] = {};
    return state.cal[key];
  }

  // ---------- 오늘의 단어 ----------
  function todaySet() {
    var t = today();
    if (state.wToday && state.wToday.date === t) return state.wToday;
    // 어제 다 못 한 단계는 오늘 이어서
    if (state.wToday && !state.wToday.passed) { state.wToday.date = t; state.wToday.step = 0; TE.save(); return state.wToday; }
    if (state.wPos >= WORDS.length) return null; // 단어를 다 배움
    var n = state.wPos < BASIC_COUNT ? BASIC_PER_DAY : state.wPerDay;
    var idx = [];
    for (var i = state.wPos; i < Math.min(WORDS.length, state.wPos + n); i++) idx.push(i);
    state.wToday = { date: t, stage: state.wStage, idx: idx, step: 0, passed: false };
    TE.save();
    return state.wToday;
  }
  function stageName(st) { return st <= BASIC_STAGES ? "기초 " + st + "단계" : st + "단계"; }

  // 단어가 들어간 앱 속 여행 문장 찾기
  function linkedSentences(w) {
    var wt = TE.tokens(w.en);
    var exT = TE.tokens(w.ex).join(" ");
    return TE.allSentences().filter(function (s) {
      var st = TE.tokens(s.en);
      if (st.join(" ") === exT) return false;
      for (var i = 0; i + wt.length <= st.length; i++) {
        if (st.slice(i, i + wt.length).join(" ") === wt.join(" ")) return true;
      }
      return false;
    }).slice(0, 3);
  }

  // ---------- 복습 ----------
  function dueList() {
    var t = today();
    return Object.keys(state.learned).filter(function (k) {
      return state.learned[k].due <= t;
    }).map(Number);
  }
  function markReview(i, ok) {
    var L = state.learned[i];
    if (ok) {
      L.box = Math.min(L.box + 1, INTERVALS.length);
      L.due = addDays(today(), L.box >= INTERVALS.length ? 60 : INTERVALS[L.box]);
    } else {
      L.box = 0;
      L.due = addDays(today(), 1);
    }
  }

  // ---------- 하루 기록과 도장 ----------
  function ensureNeedR() {
    var r = dayRec();
    if (r.needR === undefined) { r.needR = dueList().length > 0; TE.save(); }
  }
  function dayStatus(key) {
    var r = state.cal[key] || {};
    var s = !!(state.daily[key] && state.daily[key].done);
    var w = !!r.w, rv = !r.needR || !!r.r;
    return { s: s, w: w, r: rv, needR: !!r.needR, all: s && w && rv, any: s || w || !!r.r };
  }
  function checkDay() {
    ensureNeedR();
    var st = dayStatus(today());
    var r = dayRec();
    if (st.all && !r.stamp) {
      r.stamp = true; TE.save();
      showStamp();
    }
    renderTodo(); renderCalendar();
  }
  function showStamp() {
    var m = $("stampModal");
    var bs = $("bigStamp");
    bs.style.animation = "none"; void bs.offsetWidth; bs.style.animation = "";
    var days = Object.keys(state.cal).filter(function (k) { return state.cal[k].stamp; }).length;
    $("stampMsg").textContent = "오늘 할 일을 다 했어요! 🎉 도장 " + days + "개째";
    m.classList.remove("hidden");
    if (navigator.vibrate) try { navigator.vibrate(80); } catch (e) {}
  }
  $("stampClose").onclick = function () { $("stampModal").classList.add("hidden"); };

  function renderTodo() {
    ensureNeedR();
    var st = dayStatus(today());
    var due = dueList().length;
    var set = todaySet();
    var items = [
      { ok: st.s, t: "오늘의 문장 외우기", btn: null },
      { ok: st.w, t: set ? "오늘의 단어 (" + stageName(set.stage) + ")" : "단어 공부 (모두 배웠어요!)", btn: st.w ? null : "words" }
    ];
    if (st.needR) items.push({ ok: st.r, t: "복습" + (due ? " (" + due + "개 남음)" : ""), btn: st.r ? null : "review" });
    var html = items.map(function (it, k) {
      return '<div class="todo"><span class="chk">' + (it.ok ? "✅" : "⬜") + '</span><span class="t">' + esc(it.t) + "</span>" +
        (it.btn ? '<button data-go="' + it.btn + '">하러 가기</button>' : "") + "</div>";
    }).join("");
    if (st.all) html += '<div class="result ok" style="text-align:center">💮 오늘 다 했어요. 참 잘했어요!</div>';
    $("todoList").innerHTML = html;
    Array.prototype.forEach.call($("todoList").querySelectorAll("button[data-go]"), function (b) {
      b.onclick = function () {
        if (b.dataset.go === "review") { mode = "review"; startReview(); }
        else mode = "study";
        TE.showTab("words");
      };
    });
  }

  // ---------- 달력 ----------
  var calY, calM;
  function renderCalendar() {
    var now = new Date();
    if (calY === undefined) { calY = now.getFullYear(); calM = now.getMonth(); }
    $("calTitle").textContent = calY + "년 " + (calM + 1) + "월";
    var first = new Date(calY, calM, 1).getDay();
    var days = new Date(calY, calM + 1, 0).getDate();
    var html = "일월화수목금토".split("").map(function (d) { return '<div class="dow">' + d + "</div>"; }).join("");
    for (var i = 0; i < first; i++) html += '<div class="d empty"></div>';
    var t = today();
    for (var d = 1; d <= days; d++) {
      var key = TE.dateKey(new Date(calY, calM, d));
      var rec = state.cal[key] || {};
      var st = dayStatus(key);
      var mark = rec.stamp ? '<span class="mini-stamp">참잘</span>' : (st.any ? '<span class="cal-dot"></span>' : "");
      html += '<div class="d' + (key === t ? " today" : "") + '" data-day="' + key + '">' + d + mark + "</div>";
    }
    $("calGrid").innerHTML = html;
    Array.prototype.forEach.call($("calGrid").querySelectorAll("[data-day]"), function (c) {
      c.onclick = function () { showDay(c.dataset.day); };
    });
  }
  $("calPrev").onclick = function () { calM--; if (calM < 0) { calM = 11; calY--; } renderCalendar(); };
  $("calNext").onclick = function () { calM++; if (calM > 11) { calM = 0; calY++; } renderCalendar(); };

  // ---------- 단어 화면 ----------
  var mode = "study"; // study | review
  var card = 0;       // 외우기/말하기에서 몇 번째 단어
  var quiz = null;    // { list:[{i,type}], pos, right, review }

  function box(html) { $("wordsMain").innerHTML = html; }
  function header(set) {
    var steps = ["① 외우기", "② 말하기", "③ 테스트"].map(function (n, k) {
      var cls = set.passed ? "done" : (k < set.step ? "done" : k === set.step ? "on" : "");
      return '<span class="' + cls + '">' + n + "</span>";
    }).join("");
    var learnedN = Object.keys(state.learned).length;
    return '<div class="label">' + stageName(set.stage) + " · 오늘의 단어 " + set.idx.length + "개 · 지금까지 " + learnedN + "개 배움</div>" +
      '<div class="steps">' + steps + "</div>";
  }
  function reviewBanner() {
    var due = dueList().length;
    if (!due) return "";
    return '<div class="card result info" style="margin:12px 0">🔁 복습할 단어가 <b>' + due + '개</b> 있어요.' +
      '<div class="row"><button class="primary big" id="goReview">복습하기</button></div></div>';
  }

  function renderWords() {
    ensureNeedR();
    if (mode === "review") return renderQuiz();
    var set = todaySet();
    if (!set) {
      box(reviewBanner() + '<div class="card"><div class="en">🎓 준비된 단어를 모두 배웠어요!</div><div class="ko">복습으로 잊지 않게 해 주세요. 단어는 앞으로 더 넣을 수 있어요.</div></div>');
      bindReview(); return;
    }
    if (set.passed) {
      var next = state.wPos < BASIC_COUNT ? BASIC_PER_DAY : state.wPerDay;
      box(reviewBanner() + '<div class="card">' + header(set) +
        '<div class="en">🎉 오늘 단어 통과!</div><div class="ko">내일은 ' + stageName(state.wStage) + " (" + Math.min(next, WORDS.length - state.wPos) + "개)가 기다려요.</div>" +
        wordListHtml(set.idx) +
        '<div class="row"><button class="big" id="again">오늘 단어 다시 보기</button></div></div>');
      $("again").onclick = function () { set.step = 0; card = 0; set.passed = true; renderStudy(set, true); };
      bindSpeakButtons(); bindReview(); return;
    }
    if (set.step === 0) renderStudy(set);
    else if (set.step === 1) renderSpeak(set);
    else startTest(set);
  }
  function wordListHtml(idx) {
    return '<div style="margin-top:12px">' + idx.map(function (i) {
      var w = WORDS[i];
      return '<div class="list-item"><div class="txt"><div class="e">' + esc(w.en) + '</div><div class="k">' + esc(w.ko) +
        '</div></div><button data-say="' + esc(w.en) + '">🔊</button></div>';
    }).join("") + "</div>";
  }
  function bindSpeakButtons() {
    Array.prototype.forEach.call($("wordsMain").querySelectorAll("[data-say]"), function (b) {
      b.onclick = function () { TE.speak(b.dataset.say); };
    });
  }
  function bindReview() {
    var g = $("goReview");
    if (g) g.onclick = function () { mode = "review"; startReview(); renderWords(); window.scrollTo(0, 0); };
  }

  // ① 외우기
  function renderStudy(set, readOnly) {
    if (card >= set.idx.length) card = set.idx.length - 1;
    var w = WORDS[set.idx[card]];
    var links = linkedSentences(w);
    box(reviewBanner() + '<div class="card">' + header(set) +
      '<div class="progress"><i style="width:' + ((card + 1) / set.idx.length * 100) + '%"></i></div>' +
      '<div class="small">' + (card + 1) + " / " + set.idx.length + "</div>" +
      '<div class="word-big" id="wBig">' + esc(w.en) + '</div><div class="ko">' + esc(w.ko) + "</div>" +
      '<div class="row"><button class="big" data-say="' + esc(w.en) + '">🔊 듣기</button><button class="big" id="slowW">🐢 천천히</button><button class="big" id="phW">🔤 파닉스</button></div>' +
      '<div class="ex"><div class="label">예문</div><div class="e"><span id="wEx">' + esc(w.ex) + '</span> <button data-say="' + esc(w.ex) + '" style="min-height:36px;padding:4px 10px">🔊</button></div><div class="k">' + esc(w.exko) + '</div><div id="wExExp"></div></div>' +
      (links.length ? '<div class="linked"><div class="label">이 단어가 나오는 여행 문장</div>' + links.map(function (s) {
        return "<div>• " + esc(s.en) + ' <span class="small">' + esc(s.ko) + "</span></div>";
      }).join("") + "</div>" : "") +
      '<div class="row"><button class="big" id="prevW"' + (card === 0 ? " disabled" : "") + '>◀ 이전</button>' +
      (card < set.idx.length - 1 ? '<button class="big primary" id="nextW">다음 ▶</button>'
        : (readOnly ? '<button class="big primary" id="doneW">다 봤어요</button>' : '<button class="big primary" id="toSpeak">말하기로 ▶</button>')) +
      "</div></div>");
    bindSpeakButtons(); bindReview();
    $("slowW").onclick = function () { TE.speak(w.en, true); };
    if (TE.decorate) { TE.decorate($("wEx"), $("wExExp")); TE.decorate($("wBig"), null); }
    $("phW").onclick = function () {
      // 두 단어짜리(thank you 등)는 첫 단어부터 보여 주고, 나머지는 예문에서 눌러 보게 함
      if (TE.showPhonics) TE.showPhonics(w.en.split(" ")[0]);
    };
    $("prevW").onclick = function () { card--; renderStudy(set, readOnly); };
    if ($("nextW")) $("nextW").onclick = function () { card++; renderStudy(set, readOnly); };
    if ($("toSpeak")) $("toSpeak").onclick = function () { set.step = 1; card = 0; TE.save(); renderWords(); };
    if ($("doneW")) $("doneW").onclick = function () { card = 0; renderWords(); };
  }

  // ② 말하기
  function renderSpeak(set) {
    if (card >= set.idx.length) card = set.idx.length - 1;
    var w = WORDS[set.idx[card]];
    box('<div class="card">' + header(set) +
      '<div class="progress"><i style="width:' + ((card + 1) / set.idx.length * 100) + '%"></i></div>' +
      '<div class="small">' + (card + 1) + " / " + set.idx.length + " · 듣고 따라 말해 보세요</div>" +
      '<div class="word-big">' + esc(w.en) + '</div><div class="ko">' + esc(w.ko) + "</div>" +
      '<div class="row"><button class="big" data-say="' + esc(w.en) + '">🔊 듣기</button></div>' +
      '<div class="row"><button class="big mic primary" id="wMic">🎤 따라 말하기</button></div>' +
      '<div id="wResult"></div>' +
      '<div class="small" style="margin-top:8px">짧은 단어는 폰이 잘 못 알아들을 수 있어요. 안 되면 예문으로 말하거나 넘어가도 괜찮아요.</div>' +
      '<div class="row"><button class="big" id="wMicEx">🎤 예문으로 말하기</button></div>' +
      '<div class="row"><button class="big" id="prevS"' + (card === 0 ? " disabled" : "") + '>◀ 이전</button>' +
      (card < set.idx.length - 1 ? '<button class="big primary" id="nextS">다음 ▶</button>' : '<button class="big primary" id="toTest">테스트 보기 ▶</button>') +
      "</div></div>");
    bindSpeakButtons();
    $("wMic").onclick = function () { TE.listen($("wMic"), w.en, $("wResult")); };
    $("wMicEx").onclick = function () { $("wResult").innerHTML = '<div class="result info">' + esc(w.ex) + "</div>"; TE.listen($("wMicEx"), w.ex, $("wResult")); };
    $("prevS").onclick = function () { card--; renderSpeak(set); };
    if ($("nextS")) $("nextS").onclick = function () { card++; renderSpeak(set); };
    if ($("toTest")) $("toTest").onclick = function () { set.step = 2; card = 0; TE.save(); quiz = null; renderWords(); };
  }

  // ③ 테스트 / 복습 문제
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function makeQuestions(idx, review) {
    var types = review ? ["ko2en", "listen"] : ["ko2en", "listen", "en2ko"];
    return shuffle(idx).map(function (i, k) { return { i: i, type: types[k % types.length] }; });
  }
  function startTest(set) {
    if (!quiz || quiz.review) quiz = { list: makeQuestions(set.idx, false), pos: 0, right: 0, review: false, wrongs: [] };
    renderQuiz();
  }
  function startReview() {
    var due = shuffle(dueList()).slice(0, 20);
    quiz = { list: makeQuestions(due, true), pos: 0, right: 0, review: true, wrongs: [] };
  }
  function options(i, field) {
    var pool = Object.keys(state.learned).map(Number).concat(todaySet() ? todaySet().idx : []);
    if (pool.length < 8) for (var k = 0; k < Math.min(WORDS.length, 60); k++) pool.push(k);
    pool = shuffle(pool.filter(function (x, p, a) { return x !== i && a.indexOf(x) === p && WORDS[x][field] !== WORDS[i][field]; })).slice(0, 3);
    return shuffle(pool.concat([i]));
  }
  function renderQuiz() {
    if (!quiz) { mode = "study"; return renderWords(); }
    var q = quiz.list[quiz.pos];
    if (!q) return finishQuiz();
    var w = WORDS[q.i];
    var field = q.type === "en2ko" ? "ko" : "en";
    if (q.type === "listen") field = "ko";
    var opts = q.opts || (q.opts = options(q.i, field));
    var ask = q.type === "ko2en" ? '<div class="label">이 뜻의 영어 단어는?</div><div class="word-big">' + esc(w.ko) + "</div>"
      : q.type === "en2ko" ? '<div class="label">이 단어의 뜻은?</div><div class="word-big">' + esc(w.en) + "</div>"
      : '<div class="label">잘 듣고 뜻을 고르세요</div><div class="row"><button class="big primary" id="qPlay">🔊 다시 듣기</button></div>';
    var title = quiz.review ? "🔁 복습" : "③ 테스트";
    box('<div class="card"><div class="label">' + title + " · " + (quiz.pos + 1) + " / " + quiz.list.length + " · 맞힌 개수 " + quiz.right + "</div>" +
      '<div class="progress"><i style="width:' + (quiz.pos / quiz.list.length * 100) + '%"></i></div>' + ask +
      '<div class="choices">' + opts.map(function (o) {
        return '<button data-o="' + o + '">' + esc(WORDS[o][field]) + "</button>";
      }).join("") + "</div>" +
      '<div id="qFb"></div></div>');
    if (q.type === "listen") { $("qPlay").onclick = function () { TE.speak(w.en); }; TE.speak(w.en); }
    Array.prototype.forEach.call($("wordsMain").querySelectorAll("[data-o]"), function (b) {
      b.onclick = function () {
        if (q.answered) return;
        q.answered = true;
        var ok = +b.dataset.o === q.i;
        if (ok) quiz.right++; else quiz.wrongs.push(q.i);
        if (quiz.review) { markReview(q.i, ok); addLog("rev", [q.i]); }
        TE.save();
        Array.prototype.forEach.call($("wordsMain").querySelectorAll("[data-o]"), function (x) {
          if (+x.dataset.o === q.i) x.classList.add("right");
          else if (x === b) x.classList.add("wrong");
        });
        $("qFb").innerHTML = '<div class="result ' + (ok ? "ok" : "bad") + '">' + (ok ? "⭕ 맞았어요!" : "❌ 정답: " + esc(w.en) + " = " + esc(w.ko)) +
          '<div class="heard">' + esc(w.ex) + "</div></div>" +
          '<div class="row"><button class="big primary" id="qNext">다음 ▶</button></div>';
        TE.speak(w.en);
        $("qNext").onclick = function () { quiz.pos++; renderQuiz(); };
      };
    });
  }
  function finishQuiz() {
    var n = quiz.list.length, r = quiz.right, pct = n ? Math.round(r / n * 100) : 100;
    var wrongHtml = quiz.wrongs.length ? '<div class="label" style="margin-top:12px">틀린 단어</div>' + wordListHtml(quiz.wrongs) : "";
    if (quiz.review) {
      var rec = dayRec();
      if (!dueList().length) rec.r = true;
      TE.save();
      box('<div class="card"><div class="en">🔁 복습 끝! ' + r + " / " + n + "</div>" +
        '<div class="ko">' + (quiz.wrongs.length ? "틀린 단어는 내일 다시 나와요." : "모두 맞혔어요! 다음 복습은 더 나중에 나와요.") + "</div>" +
        wrongHtml + '<div class="row"><button class="big primary" id="qDone">확인</button></div></div>');
      bindSpeakButtons();
      $("qDone").onclick = function () { quiz = null; mode = "study"; renderWords(); };
      checkDay();
      return;
    }
    var set = todaySet();
    if (pct >= PASS * 100) {
      set.passed = true;
      set.idx.forEach(function (i) { state.learned[i] = { box: 0, due: addDays(today(), INTERVALS[0]) }; });
      state.wPos = Math.max(state.wPos, set.idx[set.idx.length - 1] + 1);
      state.wStage = set.stage + 1;
      dayRec().w = true;
      addLog("words", set.idx);
      TE.save();
      var unlocked = state.wPos >= BASIC_COUNT && set.stage === BASIC_STAGES;
      box('<div class="card"><div class="en">🎉 통과! ' + r + " / " + n + " (" + pct + "%)</div>" +
        '<div class="ko">' + stageName(set.stage) + " 완료! 배운 단어는 내일부터 복습에 나와요.</div>" +
        (unlocked ? '<div class="result ok">🎓 기초 10단계를 모두 끝냈어요! 이제 설정에서 하루 단어 개수를 고를 수 있어요.</div>' : "") +
        wrongHtml + '<div class="row"><button class="big primary" id="qDone">확인</button></div></div>');
      quiz = null;
      bindSpeakButtons();
      $("qDone").onclick = function () { renderWords(); };
      checkDay();
    } else {
      box('<div class="card"><div class="en">😅 ' + r + " / " + n + " (" + pct + "%)</div>" +
        '<div class="ko">80% 이상 맞히면 통과예요. 조금만 더 외우고 다시 해 봐요!</div>' + wrongHtml +
        '<div class="row"><button class="big" id="reStudy">다시 외우기</button><button class="big primary" id="reTest">테스트 다시</button></div></div>');
      bindSpeakButtons();
      $("reStudy").onclick = function () { set.step = 0; card = 0; quiz = null; TE.save(); renderWords(); };
      $("reTest").onclick = function () { quiz = null; startTest(set); };
    }
  }

  // ---------- 설정: 하루 단어 개수 ----------
  function renderWordSettings() {
    var unlocked = state.wPos >= BASIC_COUNT;
    Array.prototype.forEach.call(document.querySelectorAll("#wordCountSeg button"), function (b) {
      b.disabled = !unlocked;
      b.classList.toggle("on", unlocked && +b.dataset.n === state.wPerDay);
      b.onclick = function () { state.wPerDay = +b.dataset.n; TE.save(); renderWordSettings(); };
    });
    $("wordCountInfo").textContent = unlocked
      ? "다음 단계부터 하루 " + state.wPerDay + "개씩 나와요."
      : "기초 10단계까지는 하루 5개씩이에요. 지금 " + stageName(Math.min(state.wStage, BASIC_STAGES)) + " (기초 단어 " + Math.min(state.wPos, BASIC_COUNT) + "/" + BASIC_COUNT + "개)";
  }

  TE.renderWords = function () { renderWords(); };
  TE.renderCalendar = function () { renderTodo(); renderCalendar(); };
  TE.renderWordSettings = renderWordSettings;
  TE.checkDay = checkDay;
  // ---------- 날짜별 기록 ----------
  function addLog(kind, list, key) {
    var r = dayRec(key);
    r[kind] = r[kind] || [];
    list.forEach(function (x) { if (r[kind].indexOf(x) < 0) r[kind].push(x); });
    TE.save();
  }
  // 문장을 맞게 말했거나 외운 날 기록
  TE.logSentence = function (id) {
    if (!id) return;
    addLog("sent", [id]);
    state.sentOk = state.sentOk || {};
    if (!state.sentOk[id]) state.sentOk[id] = today();
    TE.save();
  };
  // 예전 기록 옮기기 (이 기능이 생기기 전에 공부한 것)
  (function migrate() {
    if (state.wToday && state.wToday.passed) {
      var r = state.cal[state.wToday.date];
      if (r && r.w && !r.words) r.words = state.wToday.idx.slice();
    }
    state.sentOk = state.sentOk || {};
    Object.keys(state.daily).forEach(function (k) {
      var d = state.daily[k];
      if (d.done) {
        if (!state.sentOk[d.id]) state.sentOk[d.id] = k;
        var r = dayRec(k); r.sent = r.sent || [];
        if (r.sent.indexOf(d.id) < 0) r.sent.push(d.id);
      }
    });
    TE.save();
  })();

  function showDay(key) {
    var r = state.cal[key] || {};
    var p = key.split("-");
    var st = dayStatus(key);
    var daily = state.daily[key];
    var sec = function (title, rows) {
      if (!rows.length) return "";
      return '<div class="label" style="margin-top:14px">' + title + "</div>" + rows.map(function (x) {
        return '<div class="list-item"><div class="txt"><div class="e">' + esc(x.en) + '</div><div class="k">' + esc(x.ko) +
          '</div></div><button data-say="' + esc(x.en) + '">🔊</button></div>';
      }).join("");
    };
    var words = (r.words || []).map(function (i) { return WORDS[i]; });
    var rev = (r.rev || []).filter(function (i) { return (r.words || []).indexOf(i) < 0; }).map(function (i) { return WORDS[i]; });
    var sents = (r.sent || []).map(function (id) { return TE.byId(id); }).filter(Boolean);
    var body = sec("📖 새로 배운 단어 (" + words.length + ")", words) +
      sec("🔁 복습한 단어 (" + rev.length + ")", rev) +
      sec("💬 공부한 문장 (" + sents.length + ")", sents);
    if (!body) body = '<div class="ko" style="margin-top:12px">이 날은 공부 기록이 없어요.</div>';
    var badge = r.stamp ? '<span class="mini-stamp" style="width:44px;height:44px;font-size:13px;transform:rotate(-12deg)">참잘</span>' : "";
    $("dayTitle").innerHTML = (+p[1]) + "월 " + (+p[2]) + "일 " + badge;
    $("dayBody").innerHTML =
      '<div class="small">' + (st.s ? "✅" : "⬜") + " 오늘의 문장 &nbsp; " + (st.w ? "✅" : "⬜") + " 단어 테스트" +
      (r.needR ? " &nbsp; " + (r.r ? "✅" : "⬜") + " 복습" : "") + "</div>" + body;
    Array.prototype.forEach.call($("dayBody").querySelectorAll("[data-say]"), function (b) {
      b.onclick = function () { TE.speak(b.dataset.say); };
    });
    $("dayModal").classList.remove("hidden");
  }
  $("dayClose").onclick = function () { $("dayModal").classList.add("hidden"); };
  $("dayModal").onclick = function (e) { if (e.target === $("dayModal")) $("dayModal").classList.add("hidden"); };

  TE.learnedWords = function () { return Object.keys(state.learned).map(Number); };
  TE.learnedSentences = function () {
    return Object.keys(state.sentOk || {}).map(function (id) { return TE.byId(id); }).filter(Boolean);
  };

  TE._w = { addDays: addDays, dueList: dueList, state: state, quiz: function () { return quiz; } };

  renderTodo(); renderCalendar(); renderWordSettings();
})();
