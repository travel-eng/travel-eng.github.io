// 💬 듣고 대답하기 (말하기 탭 안)
(function () {
  var TE = window.TE, $ = TE.$, esc = TE.esc, state = TE.state;
  var DL = window.DIALOGS || [];
  if (!state.dlg) state.dlg = {};
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var NUMW = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen twenty thirty forty fifty hundred half couple few".split(" ");
  var cur = null; // { d, t, tries, firstOk, log: [] }
  var rec = null;

  function norm(s) { return " " + s.toLowerCase().replace(/[^a-z0-9'\- ]+/g, " ").replace(/\s+/g, " ").trim() + " "; }
  // 대답이 맞는지 너그럽게 보기: 핵심 말이 들어 있거나, 모범 대답과 많이 비슷하면 통과
  function judge(turn, heard) {
    var h = norm(heard);
    if (!h.trim()) return { ok: false, score: 0 };
    if (turn.mine) { var sc = TE.compare(turn.ans[0], heard).score; return { ok: sc >= 0.6, score: sc }; }
    var keysOk = turn.keys.every(function (g) {
      return g.some(function (k) {
        if (k === "#any") return h.trim().length > 0;
        if (k === "#num") return /\d/.test(h) || NUMW.some(function (w) { return h.indexOf(" " + w + " ") >= 0; });
        return h.indexOf(" " + k.toLowerCase() + " ") >= 0 || (k.indexOf(" ") < 0 && h.indexOf(" " + k.toLowerCase() + "s ") >= 0);
      });
    });
    var best = 0;
    turn.ans.forEach(function (a) { var c = TE.compare(a, heard).score; if (c > best) best = c; });
    return { ok: keysOk || best >= 0.6, score: best };
  }
  TE._dlgJudge = judge;

  function wrap() { return $("dlgWrap"); }
  function doneToday(id) { var r = (state.cal || {})[TE.dateKey()]; return !!(r && r.dlg && r.dlg.indexOf(id) >= 0); }
  // 오늘의 추천 장면: 날마다 하나씩 돌아가며
  function todayIdx() { var p = TE.dateKey().split("-"); return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5) % DL.length; }

  // ---- 📚 내가 배운 문장: 오늘의 문장·이야기·따라 말하기로 배운 것 ----
  function learnedPool() {
    var seen = {}, out = [];
    function add(s) { if (s && !seen[s.id]) { seen[s.id] = 1; out.push(s); } }
    (TE.learnedSentences ? TE.learnedSentences() : []).forEach(add);
    Object.keys(state.cal || {}).forEach(function (k) { (state.cal[k].sent || []).forEach(function (id) { add(TE.byId(id)); }); });
    return out;
  }
  function cueFor(s) {
    // 이야기 문장이면 바로 앞에 상대가 한 말을 질문으로 씀
    var m = /^s(\d+)_(\d+)$/.exec(s.id);
    if (m && window.STORY) {
      var ep = window.STORY.episodes[+m[1]], prev = ep && ep.lines[+m[2] - 1];
      if (prev && prev.who === "npc") return { q: prev.en, qko: prev.ko };
    }
    // 장면 대화의 모범 대답과 같은 문장이면 그 질문을 씀
    var low = s.en.toLowerCase(), hit = null;
    DL.forEach(function (d) { d.turns.forEach(function (t) { if (!hit && t.ans.some(function (a) { return a.toLowerCase() === low; })) hit = t; }); });
    return hit ? { q: hit.q, qko: hit.qko } : null;
  }
  function mineScene() {
    var pool = learnedPool().slice();
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    var turns = pool.slice(0, 5).map(function (s) {
      var c = cueFor(s), first = s.en.split(" ").slice(0, 2).join(" ");
      return { mine: true, q: c ? c.q : "", qko: c ? c.qko : "", ko: s.ko, ans: [s.en], hint: "배운 문장이에요: " + s.ko + " → " + first + " …" };
    });
    return { id: "mine", icon: "📚", scene: "복습", title: "내가 배운 문장", who: "상대방", turns: turns };
  }
  function stopRec() { if (rec) { try { rec.abort(); } catch (e) {} rec = null; } }

  function renderList() {
    stopRec(); cur = null;
    var ti = todayIdx(), anyToday = DL.some(function (d) { return doneToday(d.id); }) || doneToday("mine");
    wrap().innerHTML = '<div class="card"><div class="label">💬 듣고 대답하기 · ' + (anyToday ? "✅ 오늘 할 일 완료! 더 해도 좋아요" : "오늘 한 장면 하기 (⭐ 추천)") + "</div>" +
      '<div class="small">상대가 영어로 물어보면 🎤로 대답해요. 뜻이 통하면 통과예요. ✅는 오늘 한 것 (매일 새로 시작해요).</div>' +
      '<div class="dlg-grid"><button class="dlg-pick" id="dlgMine"><span class="ic">📚</span><b>내가 배운 문장</b><span class="small">배운 ' + learnedPool().length + "개 중 5개" + (doneToday("mine") ? " ✅" : "") + "</span></button>" + DL.map(function (d, i) {
        return '<button class="dlg-pick' + (i === ti ? " today" : "") + '" data-i="' + i + '"><span class="ic">' + d.icon + (i === ti ? ' <span class="small">⭐ 오늘</span>' : "") + "</span><b>" + esc(d.title) + '</b><span class="small">' + esc(d.scene) + " · " + d.turns.length + "번" + (doneToday(d.id) ? " ✅" : "") + "</span></button>";
      }).join("") + "</div></div>";
    Array.prototype.forEach.call(wrap().querySelectorAll(".dlg-pick"), function (b) {
      if (b.id !== "dlgMine") b.onclick = function () { start(DL[+b.dataset.i]); };
    });
    $("dlgMine").onclick = function () {
      var sc = mineScene();
      if (!sc.turns.length) { wrap().querySelector(".small").innerHTML = "아직 배운 문장이 없어요. ☀️오늘 탭에서 문장을 외우거나 🔁따라 말하기에 성공하면 여기 나와요."; return; }
      start(sc);
    };
  }

  function start(d) { cur = { d: d, t: 0, tries: 0, firstOk: 0, log: [] }; renderTurn(true); }

  function renderTurn(play) {
    var d = cur.d, turn = d.turns[cur.t];
    var past = cur.log.map(function (l) {
      return '<div class="bub npc">' + (l.q ? "<b>" + esc(d.who) + ":</b> " + esc(l.q) : "💭 " + esc(l.ko)) + '</div><div class="bub me">' + esc(l.a) + "</div>";
    }).slice(-2).join("");
    wrap().innerHTML = '<div class="card">' +
      '<div class="row" style="align-items:center;margin:0"><span class="label" style="flex:1;margin:0">' + d.icon + " " + esc(d.title) + " · " + (cur.t + 1) + "/" + d.turns.length + '</span><button id="dlgBack">◀ 장면</button></div>' +
      '<div class="chat">' + past +
      (turn.q ? '<div class="bub npc" id="dlgQ"><b>' + esc(d.who) + ':</b> <span id="dlgQt">🎧 잘 듣고 대답해 보세요</span></div></div>' +
      '<div class="row"><button id="dlgPlay">🔊 다시</button><button id="dlgSlow">🐢 천천히</button><button id="dlgShow">👀 글자</button></div>'
      : '<div class="bub npc" id="dlgQ">💭 이 말을 영어로 해 보세요<div class="en" style="font-size:18px;margin:2px 0 0">' + esc(turn.ko) + '</div><span id="dlgQt"></span></div></div>') +
      '<div class="row"><button class="big mic primary" id="dlgMic">🎤 대답하기</button></div>' +
      '<div class="row"><button id="dlgHint">💡 힌트</button><button id="dlgModel">🗣 모범 대답</button><button id="dlgSkip">건너뛰기 ▶</button></div>' +
      '<div id="dlgInfo"></div><div id="dlgRes"></div></div>';
    $("dlgBack").onclick = renderList;
    if (turn.q) {
      $("dlgPlay").onclick = function () { TE.speak(turn.q); };
      $("dlgSlow").onclick = function () { TE.speak(turn.q, true); };
      $("dlgShow").onclick = showQ;
    }
    $("dlgHint").onclick = function () { $("dlgInfo").innerHTML = '<div class="result info">💡 ' + esc(turn.hint) + "</div>"; };
    $("dlgModel").onclick = function () {
      showQ();
      $("dlgInfo").innerHTML = '<div class="result info">🗣 이렇게 말해요:' + turn.ans.map(function (a, i) {
        return '<div class="dlg-ans" data-a="' + i + '">🔊 ' + esc(a) + "</div>";
      }).join("") + "</div>";
      Array.prototype.forEach.call($("dlgInfo").querySelectorAll(".dlg-ans"), function (x) { x.onclick = function () { TE.speak(turn.ans[+x.dataset.a]); }; });
      TE.speak(turn.ans[0]);
    };
    $("dlgSkip").onclick = function () { next(turn, "(건너뜀)"); };
    $("dlgMic").onclick = function () { answer(turn); };
    if (play && turn.q) setTimeout(function () { TE.speak(turn.q); }, 250);
  }
  function showQ() {
    var turn = cur.d.turns[cur.t];
    if (!turn.q) { $("dlgQt").innerHTML = '<div class="small">' + esc(turn.ans[0]) + "</div>"; return; }
    $("dlgQt").innerHTML = esc(turn.q) + '<div class="small">' + esc(turn.qko) + "</div>";
  }

  function answer(turn) {
    var btn = $("dlgMic"), res = $("dlgRes");
    if (!SR) { res.innerHTML = '<div class="result info">이 브라우저는 말하기 인식을 지원하지 않아요. 안드로이드 <b>크롬(Chrome)</b>에서 열어 주세요.</div>'; return; }
    if (rec) { stopRec(); return; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    rec = new SR(); rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 5;
    var r = rec, got = false;
    btn.classList.add("listening"); btn.textContent = "👂 듣는 중…";
    res.innerHTML = '<div class="result info">영어로 대답해 보세요.</div>';
    r.onresult = function (e) {
      got = true;
      var alts = e.results[0], best = null, heard = "";
      for (var i = 0; i < alts.length; i++) { var j = judge(turn, alts[i].transcript); if (!best || (j.ok && !best.ok) || (j.ok === best.ok && j.score > best.score)) { best = j; heard = alts[i].transcript; } }
      cur.tries++;
      var said = '<div class="heard">📱 폰이 들은 말: “' + esc(heard) + '”</div>';
      if (best.ok) {
        if (cur.tries === 1) cur.firstOk++;
        showQ();
        if (turn.mine) TE.speak(turn.ans[0]);
        res.innerHTML = '<div class="result ok">🎉 ' + (turn.mine ? "잘 기억했어요!" : "통했어요!") + said + '<div class="heard">' + (turn.mine ? "배운 문장: " : "다른 대답 예: ") + esc(turn.ans[0]) + '</div><div class="row" style="margin-top:6px"><button class="primary" id="dlgNext">다음 ▶</button></div></div>';
        $("dlgNext").onclick = function () { next(turn, heard); };
      } else {
        res.innerHTML = '<div class="result ' + (best.score >= 0.4 ? "info" : "bad") + '">' + (best.score >= 0.4 ? "🙂 거의 됐어요! 한 번 더 해 봐요." : "😅 질문과 조금 다른 대답 같아요. 💡 힌트를 보고 다시 해 봐요.") + said +
          (cur.tries >= 2 ? '<div class="heard">🗣 모범 대답: ' + esc(turn.ans[0]) + "</div>" : "") + "</div>";
      }
    };
    r.onerror = function (e) {
      got = true;
      var msg = { "not-allowed": "마이크 사용이 막혀 있어요. 크롬에서 마이크를 '허용'으로 바꿔 주세요.", "no-speech": "아무 소리도 안 들렸어요. 🎤을 누르고 바로 말해 보세요.", "network": "인터넷 연결이 필요해요.", "aborted": "취소했어요." }[e.error] || ("인식이 안 됐어요 (" + e.error + ").");
      res.innerHTML = '<div class="result info">' + msg + "</div>";
    };
    r.onend = function () {
      if (rec === r) rec = null;
      if ($("dlgMic")) { btn.classList.remove("listening"); btn.textContent = "🎤 대답하기"; }
      if (!got) res.innerHTML = '<div class="result info">아무 소리도 안 들렸어요. 다시 눌러 보세요.</div>';
    };
    try { r.start(); } catch (e) { rec = null; }
  }

  function next(turn, said) {
    stopRec();
    cur.log.push({ q: turn.q, ko: turn.ko, a: said });
    if (said !== "(건너뜀)") cur.answered = (cur.answered || 0) + 1;
    cur.t++; cur.tries = 0;
    if (cur.t < cur.d.turns.length) { renderTurn(true); return; }
    state.dlg[cur.d.id] = Math.max(state.dlg[cur.d.id] || 0, cur.firstOk) || 1;
    var n = cur.d.turns.length, enough = (cur.answered || 0) >= Math.ceil(n / 2);
    var first = enough && !DL.some(function (d) { return doneToday(d.id); }) && !doneToday("mine");
    if (enough && TE.addLog) TE.addLog("dlg", [cur.d.id]);
    TE.save();
    if (TE.checkDay) TE.checkDay();
    wrap().innerHTML = '<div class="card" style="text-align:center"><div style="font-size:40px">' + cur.d.icon + '</div><div class="en">대화 끝! 🎉</div>' +
      '<div class="ko">한 번에 통과: ' + cur.firstOk + " / " + n + "</div>" +
      (first ? '<div class="result ok">✅ 오늘의 대화 완료!</div>' : enough ? "" : '<div class="result info">건너뛴 게 많아서 오늘 할 일로는 안 쳐요. 절반 이상 대답해 봐요!</div>') +
      '<div class="small">' + (cur.firstOk === n ? "완벽해요! 실제 여행에서도 이렇게 하면 돼요." : "한 번 더 하면 더 자연스러워져요.") + "</div>" +
      '<div class="row"><button id="dlgAgain">🔁 다시 하기</button><button class="primary" id="dlgList">다른 장면 ▶</button></div></div>';
    var d = cur.d;
    $("dlgAgain").onclick = function () { start(d); };
    $("dlgList").onclick = renderList;
  }

  // 말하기 탭 안의 모드 전환
  function setMode(m) {
    state.pMode = m; TE.save();
    Array.prototype.forEach.call($("pMode").querySelectorAll("button"), function (b) { b.classList.toggle("on", b.dataset.m === m); });
    $("repWrap").classList.toggle("hidden", m !== "rep");
    wrap().classList.toggle("hidden", m !== "dlg");
    if (m === "dlg" && !cur) renderList();
    if (m !== "dlg") stopRec();
  }
  TE.openDialogs = function () { if (cur && cur.t >= cur.d.turns.length) cur = null; if (!cur) { setMode("dlg"); renderList(); } else setMode("dlg"); };
  Array.prototype.forEach.call($("pMode").querySelectorAll("button"), function (b) { b.onclick = function () { setMode(b.dataset.m); }; });
  setMode(state.pMode === "dlg" ? "dlg" : "rep");
})();
