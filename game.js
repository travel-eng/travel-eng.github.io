(function () {
  "use strict";
  var TE = window.TE, state = TE.state, $ = TE.$, esc = TE.esc, WORDS = window.WORDS;
  state.game = state.game || { bestMatch: 0, bestQuiz: 0, plays: 0 };

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function box(html) { $("gameMain").innerHTML = html; }
  function words() { return TE.learnedWords().map(function (i) { return { en: WORDS[i].en, ko: WORDS[i].ko, i: i }; }); }
  function sents() { return TE.learnedSentences(); }
  var timer = null;
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  // ---------- 첫 화면 ----------
  function home() {
    stopTimer();
    var w = words(), s = sents();
    var ready = w.length >= 4;
    box('<div class="card"><div class="label">🎮 지금까지 배운 것으로 게임해요</div>' +
      '<div class="ko">배운 단어 <b>' + w.length + '개</b> · 배운 문장 <b>' + s.length + "개</b></div>" +
      (ready ? "" : '<div class="result info">단어 1단계 테스트를 통과하면 게임이 열려요. 📖 단어 탭에서 시작해 보세요!</div>') +
      "</div>" +
      '<div class="card game-pick"><div class="en">🃏 짝 맞추기</div><div class="ko">영어와 뜻을 빨리 짝지어요. 빠를수록 좋아요!</div>' +
      '<div class="small">최고 기록: ' + (state.game.bestMatch ? state.game.bestMatch + "초" : "아직 없음") + "</div>" +
      '<div class="row"><button class="big primary" id="gMatch"' + (ready ? "" : " disabled") + '>시작</button></div></div>' +
      '<div class="card game-pick"><div class="en">⚡ 퀴즈 도전</div><div class="ko">하트 3개! 단어 맞히기, 듣고 고르기, 문장 만들기. 연속으로 맞히면 점수가 더 올라가요.</div>' +
      '<div class="small">최고 점수: ' + (state.game.bestQuiz || 0) + "점</div>" +
      '<div class="row"><button class="big primary" id="gQuiz"' + (ready ? "" : " disabled") + '>시작</button></div></div>');
    if (ready) { $("gMatch").onclick = startMatch; $("gQuiz").onclick = startQuiz; }
  }

  // ---------- 짝 맞추기 ----------
  function startMatch() {
    var pool = shuffle(words()).slice(0, 5);
    // 짧은 문장도 하나 섞기 (5단어 이하)
    var shortS = shuffle(sents().filter(function (s) { return TE.tokens(s.en).length <= 5; }));
    if (shortS.length && pool.length >= 5) pool[4] = { en: shortS[0].en, ko: shortS[0].ko };
    var left = shuffle(pool.map(function (p, k) { return { k: k, t: p.en }; }));
    var right = shuffle(pool.map(function (p, k) { return { k: k, t: p.ko }; }));
    var sel = null, done = 0, miss = 0, start = Date.now();
    box('<div class="card"><div class="label">🃏 짝 맞추기 · <span id="mTime">0</span>초 · 틀림 <span id="mMiss">0</span></div>' +
      '<div class="match"><div>' + left.map(function (x) { return '<button class="tile" data-side="L" data-k="' + x.k + '">' + esc(x.t) + "</button>"; }).join("") +
      "</div><div>" + right.map(function (x) { return '<button class="tile" data-side="R" data-k="' + x.k + '">' + esc(x.t) + "</button>"; }).join("") +
      '</div></div><div id="mFb"></div></div>');
    timer = setInterval(function () { var t = $("mTime"); if (t) t.textContent = Math.floor((Date.now() - start) / 1000); else stopTimer(); }, 250);
    Array.prototype.forEach.call(document.querySelectorAll("#gameMain .tile"), function (b) {
      b.onclick = function () {
        if (b.classList.contains("gone")) return;
        if (b.dataset.side === "L") TE.speak(b.textContent);
        if (!sel || sel.dataset.side === b.dataset.side) {
          if (sel) sel.classList.remove("sel");
          sel = b; b.classList.add("sel"); return;
        }
        if (sel.dataset.k === b.dataset.k) {
          sel.classList.remove("sel"); sel.classList.add("gone"); b.classList.add("gone");
          sel = null; done++;
          if (done === pool.length) finishMatch(Math.round((Date.now() - start) / 1000), miss);
        } else {
          miss++; $("mMiss").textContent = miss;
          var a = sel; a.classList.add("shake"); b.classList.add("shake");
          setTimeout(function () { a.classList.remove("shake", "sel"); b.classList.remove("shake"); }, 400);
          sel = null;
        }
      };
    });
  }
  function finishMatch(sec, miss) {
    stopTimer();
    var total = sec + miss * 3; // 틀리면 3초씩 벌칙
    var best = !state.game.bestMatch || total < state.game.bestMatch;
    if (best) state.game.bestMatch = total;
    state.game.plays++; TE.save();
    box('<div class="card" style="text-align:center"><div class="en">' + (best ? "🏆 새 기록!" : "🎉 다 맞췄어요!") + "</div>" +
      '<div class="ko">' + sec + "초 + 틀림 " + miss + "번×3초 = <b>" + total + "초</b></div>" +
      '<div class="small">최고 기록 ' + state.game.bestMatch + "초</div>" +
      '<div class="row"><button class="big primary" id="gAgain">한 판 더</button><button class="big" id="gBack">게임 목록</button></div></div>');
    $("gAgain").onclick = startMatch; $("gBack").onclick = home;
  }

  // ---------- 퀴즈 도전 ----------
  var G = null;
  function startQuiz() {
    G = { hearts: 3, score: 0, combo: 0, n: 0, max: 15, wrong: [] };
    nextQ();
  }
  function makeQ() {
    var w = words(), s = sents();
    var kinds = ["ko2en", "listen", "en2ko"];
    if (s.length) kinds.push("build", "build", "blank");
    var kind = kinds[Math.floor(Math.random() * kinds.length)];
    if (kind === "build" || kind === "blank") {
      var cand = s.filter(function (x) { var n = TE.tokens(x.en).length; return kind === "build" ? n <= 9 : n >= 3; });
      if (!cand.length) kind = "ko2en";
      else {
        var st = cand[Math.floor(Math.random() * cand.length)];
        var toks = st.en.replace(/[.?!,]/g, "").split(/\s+/);
        if (kind === "build") return { kind: kind, item: st, toks: toks };
        var bi = Math.floor(Math.random() * toks.length);
        var answer = toks[bi].replace(/[.,?!]/g, "");
        var others = shuffle(w.map(function (x) { return x.en; }).concat(["is", "the", "a", "to", "my", "this", "can", "please"])
          .filter(function (x) { return x.toLowerCase() !== answer.toLowerCase() && x.indexOf(" ") < 0; })).slice(0, 3);
        return { kind: kind, item: st, toks: toks, bi: bi, answer: answer, opts: shuffle(others.concat([answer])) };
      }
    }
    var it = w[Math.floor(Math.random() * w.length)];
    var field = kind === "ko2en" ? "en" : "ko";
    var opts = shuffle(w.filter(function (x) { return x.i !== it.i && x[field] !== it[field]; }));
    if (opts.length < 3) opts = opts.concat(shuffle(WORDS.slice(0, 50).filter(function (x) { return x.en !== it.en; })));
    return { kind: kind, item: it, field: field, opts: shuffle(opts.slice(0, 3).map(function (x) { return x[field]; }).concat([it[field]])) };
  }
  function hud() {
    var h = ""; for (var i = 0; i < 3; i++) h += i < G.hearts ? "❤️" : "🤍";
    return '<div class="hud"><span>' + h + "</span><span>" + (G.n + 1) + "/" + G.max + "</span><span>⭐ " + G.score +
      (G.combo >= 2 ? ' <span class="combo">🔥' + G.combo + "연속</span>" : "") + "</span></div>";
  }
  function nextQ() {
    if (G.hearts <= 0 || G.n >= G.max) return finishQuiz();
    var q = G.q = makeQ();
    var it = q.item;
    if (q.kind === "build") return renderBuild(q);
    var ask;
    if (q.kind === "ko2en") ask = '<div class="label">이 뜻의 영어는?</div><div class="word-big">' + esc(it.ko) + "</div>";
    else if (q.kind === "en2ko") ask = '<div class="label">이 영어의 뜻은?</div><div class="word-big">' + esc(it.en) + "</div>";
    else if (q.kind === "listen") ask = '<div class="label">잘 듣고 뜻을 고르세요</div><div class="row"><button class="big" id="qPlay">🔊 다시 듣기</button></div>';
    else ask = '<div class="label">빈칸에 들어갈 단어는?</div><div class="en" style="font-size:22px">' +
      q.toks.map(function (t, k) { return k === q.bi ? "<u>&nbsp;?&nbsp;&nbsp;</u>" : esc(t); }).join(" ") + '</div><div class="ko">' + esc(it.ko) + "</div>";
    box('<div class="card">' + hud() + ask + '<div class="choices">' +
      q.opts.map(function (o, k) { return '<button data-k="' + k + '">' + esc(o) + "</button>"; }).join("") + '</div><div id="gFb"></div></div>');
    if (q.kind === "listen") { TE.speak(it.en); $("qPlay").onclick = function () { TE.speak(it.en); }; }
    var right = q.kind === "blank" ? q.answer : it[q.field];
    Array.prototype.forEach.call(document.querySelectorAll("#gameMain [data-k]"), function (b) {
      b.onclick = function () {
        if (q.answered) return; q.answered = true;
        var ok = q.opts[+b.dataset.k] === right;
        Array.prototype.forEach.call(document.querySelectorAll("#gameMain [data-k]"), function (x) {
          if (q.opts[+x.dataset.k] === right) x.classList.add("right"); else if (x === b) x.classList.add("wrong");
        });
        answer(ok, it);
      };
    });
  }
  function renderBuild(q) {
    var it = q.item, picked = [];
    var tiles = shuffle(q.toks.map(function (t, k) { return { t: t, k: k }; }));
    box('<div class="card">' + hud() + '<div class="label">단어를 순서대로 눌러 문장을 만드세요</div><div class="word-big" style="font-size:24px">' + esc(it.ko) + "</div>" +
      '<div class="build-line" id="bLine"></div><div class="build-tiles">' +
      tiles.map(function (x) { return '<button class="tile" data-k="' + x.k + '">' + esc(x.t) + "</button>"; }).join("") +
      '</div><div class="row"><button class="big" id="bUndo">↩ 하나 지우기</button></div><div id="gFb"></div></div>');
    function draw() { $("bLine").textContent = picked.map(function (b) { return b.textContent; }).join(" ") || " "; }
    draw();
    Array.prototype.forEach.call(document.querySelectorAll("#gameMain .build-tiles .tile"), function (b) {
      b.onclick = function () {
        if (q.answered || b.classList.contains("gone")) return;
        b.classList.add("gone"); picked.push(b); draw();
        if (picked.length === q.toks.length) {
          q.answered = true;
          var said = picked.map(function (x) { return x.textContent; }).join(" ");
          var ok = TE.tokens(said).join(" ") === TE.tokens(it.en).join(" ");
          answer(ok, it);
        }
      };
    });
    $("bUndo").onclick = function () { if (q.answered) return; var b = picked.pop(); if (b) b.classList.remove("gone"); draw(); };
  }
  function answer(ok, it) {
    if (ok) { G.combo++; G.score += 10 + Math.min(G.combo - 1, 5) * 2; }
    else { G.combo = 0; G.hearts--; G.wrong.push(it); }
    TE.speak(it.en);
    $("gFb").innerHTML = '<div class="result ' + (ok ? "ok" : "bad") + '">' + (ok ? "⭕ 정답! +" + (10 + Math.min(G.combo - 1, 5) * 2) : "❌ 정답: " + esc(it.en)) +
      '<div class="heard">' + esc(it.en) + " = " + esc(it.ko) + "</div></div>" +
      '<div class="row"><button class="big primary" id="gNext">' + (G.hearts <= 0 ? "결과 보기" : "다음 ▶") + "</button></div>";
    G.n++;
    $("gNext").onclick = nextQ;
  }
  function finishQuiz() {
    var best = G.score > (state.game.bestQuiz || 0);
    if (best) state.game.bestQuiz = G.score;
    state.game.plays++; TE.save();
    var seen = {};
    var wrong = G.wrong.filter(function (x) { if (seen[x.en]) return false; seen[x.en] = 1; return true; });
    box('<div class="card" style="text-align:center"><div class="en">' + (G.hearts > 0 ? "🎉 끝까지 해냈어요!" : "💔 하트가 다 떨어졌어요") + "</div>" +
      '<div class="word-big">⭐ ' + G.score + "점</div>" + (best && G.score ? '<div class="result ok">🏆 최고 점수 갱신!</div>' : '<div class="small">최고 점수 ' + state.game.bestQuiz + "점</div>") +
      (wrong.length ? '<div style="text-align:left"><div class="label" style="margin-top:12px">다시 볼 것</div>' + wrong.map(function (x) {
        return '<div class="list-item"><div class="txt"><div class="e">' + esc(x.en) + '</div><div class="k">' + esc(x.ko) + '</div></div><button data-say="' + esc(x.en) + '">🔊</button></div>';
      }).join("") + "</div>" : "") +
      '<div class="row"><button class="big primary" id="gAgain">한 판 더</button><button class="big" id="gBack">게임 목록</button></div></div>');
    Array.prototype.forEach.call(document.querySelectorAll("#gameMain [data-say]"), function (b) { b.onclick = function () { TE.speak(b.dataset.say); }; });
    $("gAgain").onclick = startQuiz; $("gBack").onclick = home;
  }

  TE.renderGame = home;
  TE._g = { G: function () { return G; } };
})();
