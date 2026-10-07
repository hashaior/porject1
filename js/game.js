// The party game: pre-match picks, a live match with live questions, and the full-time podium.
// Real matches need a live-data API. Until then this plays a scripted (invented) match of about
// five minutes, using the lobby's two teams.
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const H = () => LOBBY.h;
  const L = () => LOBBY.state();
  const now = () => Date.now();
  const rand = (a, b) => a + Math.random() * (b - a);
  const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* =====================================================================
     THE SCRIPT (times are match-seconds since kick-off at 1× speed)
     ===================================================================== */
  const END = 320;             // full-time whistle
  const HT = [135, 155];       // half-time break
  const QUESTION_SECONDS = 15; // how long a live question stays open (at 1×)

  // Invented squads (the app does not use real player data yet).
  const HOME_P = ['Okafor', 'Moretti', 'Lindqvist', 'Sato', 'Delgado', 'Haddad'];
  const AWAY_P = ['Kovač', 'Brennan', 'Tavares', 'Nakamura', 'Ferreira', 'Osei'];

  // [match-second, minute] keyframes for the clock. The clock slows down while a question is open.
  const CLOCK = [[0, 0], [20, 8], [37, 9], [55, 22], [72, 23], [85, 30], [100, 34], [118, 39], [135, 45], [155, 45], [170, 51], [188, 52], [205, 62], [222, 63], [240, 75], [255, 79], [270, 85], [285, 87], [290, 88], [305, 90], [END, 94]];

  // Feed events. team: H / A / null. goal events change the score.
  const EVENTS = [
    { t: 2, type: 'whistle', text: 'Kick-off! {H} get us underway.' },
    { t: 12, type: 'chance', team: 'A', text: '{ap1} curls one just wide for {A}.' },
    { t: 20, type: 'corner', team: 'H', text: 'Corner for {H}.' },
    { t: 37, type: 'clear', team: 'A', text: '{ap4} heads the corner clear. No shot.' },
    { t: 45, type: 'save', team: 'H', text: 'Great save! {hp2} denied from close range.' },
    { t: 55, type: 'pen', team: 'H', text: 'PENALTY! {hp3} is brought down in the box.' },
    { t: 72, type: 'goal', team: 'H', text: '{hp1} sends the keeper the wrong way from the spot!', scorer: 'hp1' },
    { t: 92, type: 'save', team: 'A', text: 'Big stop from the {H} keeper to keep it 1–0.' },
    { t: 118, type: 'card', team: 'A', text: 'Yellow card for {ap2} ({A}) after a late tackle.' },
    { t: 128, type: 'chance', team: 'A', text: 'Off the post! {ap3} so close for {A}.' },
    { t: 135, type: 'whistle', text: 'Half-time. {H} lead 1–0.' },
    { t: 155, type: 'whistle', text: 'The second half is underway.' },
    { t: 162, type: 'sub', team: 'A', text: 'Substitution {A}: {ap5} comes on.' },
    { t: 170, type: 'var', team: 'A', text: 'The ball is in the net for {A}! VAR is checking…' },
    { t: 188, type: 'goal', team: 'A', text: 'The goal stands! {ap3} levels it for {A}.', scorer: 'ap3' },
    { t: 196, type: 'card', team: 'H', text: 'Yellow card for {hp4} ({H}).' },
    { t: 205, type: 'freekick', team: 'H', text: 'Free kick to {H} right on the edge of the box.' },
    { t: 222, type: 'clear', team: 'A', text: '{hp5} hits the wall. Still 1–1.' },
    { t: 232, type: 'sub', team: 'H', text: 'Substitution {H}: {hp6} comes on.' },
    { t: 262, type: 'chance', team: 'A', text: '{ap6} fires over the bar from 20 yards.' },
    { t: 270, type: 'info', text: '85 minutes played. Still level.' },
    { t: 290, type: 'goal', team: 'H', text: 'Super-sub {hp6} heads it in! {H} lead again!', scorer: 'hp6' },
    { t: 305, type: 'info', text: '4 minutes of added time.' },
    { t: 312, type: 'corner', team: 'A', text: 'Last corner for {A}… cleared!' },
    { t: END, type: 'whistle', text: 'FULL TIME! {H} win it late.' },
  ];

  // Live questions. answer = the option that wins. res = when the answer is revealed.
  const QUESTIONS = [
    { id: 'q1', open: 20, res: 37, text: 'Corner for {H}. Will it end with a shot on target?', opts: [['Y', 'YES', 30], ['N', 'NO', 20]], answer: 'N' },
    { id: 'q2', open: 55, res: 72, text: 'PENALTY to {H}! Will {hp1} score it?', opts: [['Y', 'YES', 20], ['N', 'NO', 60]], answer: 'Y' },
    { id: 'q3', open: 85, res: 118, text: 'Who gets the next yellow card?', opts: [['H', '{H}', 30], ['A', '{A}', 30], ['N', 'NOBODY BEFORE HT', 40]], answer: 'A' },
    { id: 'q4', open: 137, res: 188, text: 'Half-time! Who scores first in the second half?', opts: [['H', '{H}', 40], ['A', '{A}', 40], ['N', 'NO GOAL', 60]], answer: 'A' },
    { id: 'q5', open: 171, res: 188, text: 'VAR is checking the {A} goal. Will it stand?', opts: [['Y', 'GOAL STANDS', 30], ['N', 'NO GOAL', 30]], answer: 'Y' },
    { id: 'q6', open: 205, res: 222, text: 'Free kick for {H} on the edge of the box. Will it go in?', opts: [['Y', 'YES', 80], ['N', 'NO', 20]], answer: 'N' },
    { id: 'q7', open: 240, res: 270, text: 'Will there be another goal before the 85th minute?', opts: [['Y', 'YES', 50], ['N', 'NO', 25]], answer: 'N' },
    { id: 'q8', open: 270, res: 290, text: 'Final minutes! Will {H} score again?', opts: [['Y', 'YES', 60], ['N', 'NO', 30]], answer: 'Y' },
  ].map((q) => ({ ...q, close: q.open + QUESTION_SECONDS }));

  // Pre-match picks (answered in the waiting room).
  const PICKS = [
    { id: 'winner', text: 'Who wins the match?', pts: 50, res: END, answer: 'H', opts: [['H', '{H}'], ['D', 'DRAW'], ['A', '{A}']] },
    { id: 'first', text: 'Who scores first?', pts: 40, res: 72, answer: 'H', opts: [['H', '{H}'], ['N', 'NO GOALS'], ['A', '{A}']] },
    { id: 'btts', text: 'Will both teams score?', pts: 30, res: 188, answer: 'Y', opts: [['Y', 'YES'], ['N', 'NO']] },
    { id: 'ou', text: 'Total goals: over or under 2.5?', pts: 30, res: 290, answer: 'O', opts: [['O', 'OVER 2.5'], ['U', 'UNDER 2.5']] },
    { id: 'score', text: 'Exact final score', pts: 100, res: END, answer: '2-1', score: true },
  ];
  const MAX_PICKS = PICKS.reduce((n, p) => n + p.pts, 0);

  const GOAL_LINES = ['GOOOAL ⚽⚽', "Let's goooo!", 'What a finish 🔥', 'Called it 😎', 'Nooo 😩', 'Unbelievable!', 'VAR better not ruin this'];
  const Q_LINES = ['Easy one 😎', 'Going with my gut', "I'm sure about this one", 'Risky but YES', 'No way that goes in', '50/50 honestly'];
  const RES_LINES = ['Told you!!', 'Ugh, wrong again 😅', '+points baby 💰', 'This app is rigged 😂', 'Leaderboard here I come'];

  /* =====================================================================
     helpers
     ===================================================================== */
  const match = () => APP.match(L().matchId);
  const teamName = (side) => TEAMS[side === 'H' ? match().home : match().away][0];
  const fill = (s) => s.replace(/\{H\}/g, teamName('H')).replace(/\{A\}/g, teamName('A'))
    .replace(/\{hp(\d)\}/g, (_, n) => HOME_P[n - 1]).replace(/\{ap(\d)\}/g, (_, n) => AWAY_P[n - 1]);
  const players = () => L().players.filter((p) => p.status === 'joined');
  const me = () => L().players.find((p) => p.you);

  // Match time in match-seconds (the clock can run at 1× or 2×).
  function mt() {
    const g = L() && L().game; if (!g) return 0;
    return Math.min(END + 30, g.base.t + ((now() - g.base.real) / 1000) * g.speed);
  }
  function minuteAt(t) {
    for (let i = 1; i < CLOCK.length; i++) {
      const [t0, m0] = CLOCK[i - 1]; const [t1, m1] = CLOCK[i];
      if (t <= t1) return Math.floor(m0 + ((m1 - m0) * (t - t0)) / (t1 - t0));
    }
    return 94;
  }
  const clockLabel = (t) => {
    if (t >= END) return 'FT';
    if (t >= HT[0] && t < HT[1]) return 'HT';
    const m = minuteAt(t);
    return m > 90 ? `90+${m - 90}'` : `${Math.max(1, m)}'`;
  };
  const scoreAt = (t) => {
    const s = [0, 0];
    EVENTS.forEach((e) => { if (e.type === 'goal' && e.t <= t) s[e.team === 'H' ? 0 : 1]++; });
    return s;
  };
  const pickCorrect = (pk, v) => (pk.score ? v === pk.answer : v === pk.answer);

  // Points for a player at match time t. Picks score when they are decided; questions when revealed.
  function points(p, t) {
    let picks = 0; let live = 0; let right = 0;
    PICKS.forEach((pk) => { if (t >= pk.res && p.picks && pickCorrect(pk, p.picks[pk.id])) picks += pk.pts; });
    QUESTIONS.forEach((q) => {
      const a = p.answers && p.answers[q.id];
      if (t >= q.res && a === q.answer) { live += q.opts.find((o) => o[0] === a)[2]; right++; }
    });
    return { picks, live, total: picks + live, right };
  }
  function standings(t) {
    return players().map((p, i) => ({ p, i, ...points(p, t) }))
      .sort((a, b) => b.total - a.total || b.right - a.right || a.i - b.i);
  }
  const split = (n) => (n >= 3 ? [60, 30, 10] : [100]);

  /* =====================================================================
     friends (simulated)
     ===================================================================== */
  function randomPicks() {
    const r = () => Math.random();
    const h = Math.floor(r() * 4); const a = Math.floor(r() * 3);
    return {
      winner: h > a ? 'H' : h < a ? 'A' : 'D', first: h + a === 0 ? 'N' : r() < h / (h + a + 0.001) ? 'H' : 'A',
      btts: h > 0 && a > 0 ? 'Y' : 'N', ou: h + a > 2 ? 'O' : 'U', score: `${h}-${a}`,
    };
  }
  function randomAnswers() {
    const out = {};
    QUESTIONS.forEach((q) => {
      if (Math.random() < 0.1) return; // missed it
      out[q.id] = Math.random() < 0.55 ? q.answer : pickOne(q.opts.filter((o) => o[0] !== q.answer))[0];
    });
    return out;
  }

  /* =====================================================================
     kick-off
     ===================================================================== */
  function kickoff() {
    const S = L();
    if (!me().picks) { APP.toast('Make your picks first. They are worth up to 250 points!'); openPicks(); return; }
    S.players.forEach((p) => { if (p.status === 'invited') { p.status = 'declined'; S.chat.push({ sys: true, text: `${p.name} missed the kick-off` }); } });
    players().forEach((p) => {
      if (!p.you) { if (!p.picks) p.picks = randomPicks(); p.answers = randomAnswers(); }
    });
    me().answers = me().answers || {};
    S.phase = 'live';
    S.game = { base: { real: now(), t: 0 }, speed: 1 };
    S.chat.push({ sys: true, text: 'Kick-off! Live questions will pop up during the match. Good luck!' });
    LOBBY.persist();
    lastT = 0; seenRank = null;
    tab = 'feed';
    APP.go('matches');
    APP.toast('Kick-off! Watch for live questions ⚡');
  }

  /* =====================================================================
     engine tick (runs everywhere in the app)
     ===================================================================== */
  let lastT = null;
  let pushTimer = null;
  const onLiveScreen = () => document.getElementById('screen-lobby').classList.contains('is-active') && L() && L().phase === 'live';
  function tick() {
    const S = L();
    if (!S || !S.game) { hidePush(); return; }
    const t = mt();
    if (lastT === null) lastT = t; // after a reload, don't replay old events
    if (S.phase === 'live') {
      EVENTS.forEach((e) => { if (e.t > lastT && e.t <= t) onEvent(e); });
      QUESTIONS.forEach((q) => {
        if (q.open > lastT && q.open <= t) onQuestion(q);
        if (q.close > lastT && q.close <= t) { const p = $('#gm-push'); if (p && p.dataset.q === q.id) hidePush(); }
        if (q.res > lastT && q.res <= t) onReveal(q);
      });
      if (t >= END + 3) {
        S.phase = 'final'; LOBBY.persist();
        const st = standings(END); const rank = st.findIndex((x) => x.p.you) + 1;
        if (!onLiveOrLobby()) push({ icon: '🏁', title: 'FULL TIME', text: `${teamName('H')} ${scoreAt(END).join('–')} ${teamName('A')} · You finished #${rank}. Tap to see the podium!`, ms: 8000 });
        if (onLiveOrLobby()) render();
      }
    }
    lastT = t;
    const tabBtn = document.querySelector('#tabbar [data-go="matches"]');
    if (tabBtn) tabBtn.classList.toggle('is-live', S.phase === 'live');
    if (onLiveScreen()) update(t);
  }
  const onLiveOrLobby = () => document.getElementById('screen-lobby').classList.contains('is-active');

  function onEvent(e) {
    lastAttack = e.team || null;
    if (e.type === 'goal') {
      const s = scoreAt(e.t);
      if (!onLiveScreen()) push({ icon: '⚽', title: `GOAL! ${minuteLabel(e.t)}`, text: `${teamName('H')} ${s[0]}–${s[1]} ${teamName('A')} · ${fill(e.text)}`, ms: 5000 });
      else celebrate();
      const crew = players().filter((p) => !p.you);
      crew.slice(0, 2).forEach((p, i) => setTimeout(() => H().say(p, pickOne(GOAL_LINES)), 900 + i * 1500));
    }
    if (e.t === END && !onLiveScreen()) { /* the final push is sent when the phase changes */ }
  }
  const minuteLabel = (t) => clockLabel(t).replace('HT', "45'");
  function onQuestion(q) {
    try { navigator.vibrate && navigator.vibrate([60, 40, 60]); } catch (e) { /* not supported */ }
    if (!onLiveScreen()) {
      push({ icon: '⚡', title: `LIVE QUESTION · ${minuteLabel(q.open)}`, text: fill(q.text), cta: 'ANSWER', q: q.id, until: q.close });
    }
    const crew = players().filter((p) => !p.you);
    if (crew.length && Math.random() < 0.6) setTimeout(() => H().say(pickOne(crew), pickOne(Q_LINES)), 2500);
  }
  function onReveal(q) {
    const a = me().answers && me().answers[q.id];
    const opt = q.opts.find((o) => o[0] === a);
    const ok = a === q.answer;
    if (!onLiveScreen()) {
      push({ icon: ok ? '✅' : a ? '❌' : '⏱', title: ok ? `CORRECT! +${opt[2]} PTS` : a ? 'NOT THIS TIME' : 'YOU MISSED A QUESTION', text: fill(q.text), ms: 4500 });
    }
    const crew = players().filter((p) => !p.you);
    if (crew.length && Math.random() < 0.5) setTimeout(() => H().say(pickOne(crew), pickOne(RES_LINES)), 1800);
  }

  /* =====================================================================
     in-app "push" banner (shown when you're on another screen)
     ===================================================================== */
  function push({ icon, title, text, cta, q, until, ms }) {
    hidePush();
    document.getElementById('phone').insertAdjacentHTML('beforeend', `<div class="gm-push" id="gm-push" role="alert" ${q ? `data-q="${q}"` : ''}>
      <span class="gp-ic">${icon}</span><div class="gp-txt"><small>SHARKO · ${title}</small><b>${H().esc(text)}</b>${until ? '<i class="gp-timer"><i id="gp-bar"></i></i>' : ''}</div>
      ${cta ? `<span class="gp-cta">${cta} ›</span>` : ''}</div>`);
    const el = $('#gm-push');
    el.onclick = () => { hidePush(); APP.go('matches'); setTimeout(() => { const qEl = $('#gm-q'); if (qEl) { qEl.scrollIntoView({ block: 'center', behavior: 'smooth' }); qEl.classList.add('flash'); } }, 120); };
    if (until) {
      const step = () => {
        const bar = $('#gp-bar'); if (!bar || !L() || !L().game) return;
        const left = Math.max(0, (until - mt()) / QUESTION_SECONDS);
        bar.style.width = `${left * 100}%`;
        if (left > 0) requestAnimationFrame(step); else hidePush();
      };
      requestAnimationFrame(step);
    } else pushTimer = setTimeout(hidePush, ms || 4000);
  }
  function hidePush() { clearTimeout(pushTimer); const el = $('#gm-push'); if (el) el.remove(); }

  /* =====================================================================
     PICKS screen (before kick-off)
     ===================================================================== */
  let view = null; // 'picks' while the picks screen is open
  let draft = null;
  function openPicks() {
    const p = me();
    draft = p.picks ? { ...p.picks } : { score: '1-1' };
    view = 'picks';
    renderPicks();
  }
  function renderPicks() {
    saveScroll();
    const h = H(); const m = match();
    const done = PICKS.filter((pk) => draft[pk.id] !== undefined).length;
    const [hs, as] = draft.score.split('-').map(Number);
    screen().innerHTML = `${h.rays}<div class="scroll gm" id="gm-scroll">${h.status}
      <div class="topbar">${h.balance()}<div class="iconbtn" onclick="GAME.closePicks()" aria-label="Back to the lobby">${h.I('<path d="m15 18-6-6 6-6"/>', '#F6D58A', 24, 2.6)}</div></div>
      <div class="lb-head"><div class="woodsign"><b>MATCH PICKS</b></div></div>
      <div class="pk-intro">
        <div class="pk-teams">${h.crest(m.home, 40)}<span>VS</span>${h.crest(m.away, 40)}</div>
        <p>Answer before kick-off. Each right answer scores points on the lobby scoreboard. <b>Up to ${MAX_PICKS} pts.</b></p>
        <div class="pk-progress"><i style="width:${(done / PICKS.length) * 100}%"></i></div><small>${done}/${PICKS.length} ANSWERED</small>
      </div>
      ${PICKS.map((pk, i) => `<div class="pk card ${draft[pk.id] !== undefined ? 'set' : ''}">
        <div class="pk-top"><span class="pk-n">${i + 1}</span><b>${pk.text}</b><span class="pk-pts">+${pk.pts}</span></div>
        ${pk.score ? `<div class="pk-score">
            <div class="pk-side">${h.crest(m.home, 34)}<div class="stepper"><button onclick="GAME.step(0,-1)" aria-label="Fewer goals">–</button><b>${hs}</b><button onclick="GAME.step(0,1)" aria-label="More goals">+</button></div></div>
            <span class="pk-colon">:</span>
            <div class="pk-side">${h.crest(m.away, 34)}<div class="stepper"><button onclick="GAME.step(1,-1)" aria-label="Fewer goals">–</button><b>${as}</b><button onclick="GAME.step(1,1)" aria-label="More goals">+</button></div></div>
          </div>`
        : `<div class="pk-opts n${pk.opts.length}">${pk.opts.map(([k, label]) => `<button class="pk-opt ${draft[pk.id] === k ? 'on' : ''}" onclick="GAME.pick('${pk.id}','${k}')">${k === 'H' ? h.crest(m.home, 22) : k === 'A' ? h.crest(m.away, 22) : ''}<span>${h.esc(fill(label))}</span></button>`).join('')}</div>`}
      </div>`).join('')}
      <button class="gm-big" onclick="GAME.lockPicks()">${me().picks ? 'SAVE MY PICKS' : 'LOCK IN MY PICKS'}</button>
      <p class="gm-note">You can change your picks until kick-off.</p>
    </div>`;
    restoreScroll();
  }
  function lockPicks() {
    const missing = PICKS.filter((pk) => !pk.score && draft[pk.id] === undefined);
    if (missing.length) { APP.toast(`Answer all questions first (${missing.length} left)`); return; }
    const p = me(); const first = !p.picks;
    p.picks = { winner: draft.winner, first: draft.first, btts: draft.btts, ou: draft.ou, score: draft.score };
    if (first) L().chat.push({ sys: true, text: 'You locked in your picks' });
    LOBBY.persist();
    view = null; LOBBY.rerender();
    APP.toast(first ? 'Picks locked in! Now kick off when your crew is ready.' : 'Picks saved');
  }

  /* waiting-room card */
  function picksCard() {
    const p = me(); const h = H(); const m = match();
    const ready = players().filter((x) => x.picks).length; const n = players().length;
    if (!p.picks) {
      return `<div class="pk-card todo" onclick="GAME.openPicks()">
        <div class="pk-ic">${h.I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>', '#2B1A04', 26, 2.4)}</div>
        <div class="pk-txt"><b>MAKE YOUR PICKS</b><small>5 quick questions before kick-off · up to ${MAX_PICKS} pts</small></div><span class="pk-go">›</span></div>
        <p class="pk-crew">${ready}/${n} of your crew locked in their picks</p>`;
    }
    const lbl = (pk) => { const v = p.picks[pk.id]; if (pk.score) return v.replace('-', '–'); const o = pk.opts.find((x) => x[0] === v); return fill(o[1]); };
    return `<div class="pk-card done">
      <div class="pk-head"><b>✓ YOUR PICKS</b><button onclick="GAME.openPicks()">EDIT</button></div>
      <div class="pk-chips">
        <span><small>WINNER</small>${h.esc(lbl(PICKS[0]))}</span><span><small>SCORE</small>${h.esc(lbl(PICKS[4]))}</span>
        <span><small>FIRST GOAL</small>${h.esc(lbl(PICKS[1]))}</span><span><small>BOTH SCORE</small>${lbl(PICKS[2])}</span><span><small>GOALS</small>${lbl(PICKS[3])}</span>
      </div></div>
      <p class="pk-crew">${ready}/${n} of your crew locked in their picks</p>
      <button class="ko-btn" onclick="GAME.kickoff()"><span class="ko-ball">⚽</span><span><b>KICK OFF NOW</b><small>Demo · plays a 5-minute scripted ${h.esc(TEAMS[m.home][0])} – ${h.esc(TEAMS[m.away][0])} match</small></span></button>`;
  }

  /* =====================================================================
     LIVE screen
     ===================================================================== */
  let tab = 'feed';
  let lastAttack = null;
  let seenRank = null;
  const flashes = {}; // player name -> {pts, until}
  const screen = () => document.getElementById('screen-lobby');
  const sig = {};
  // Re-rendering replaces the page, so keep the scroll position (otherwise every tap jumps to the top).
  let keepScroll = 0;
  const saveScroll = () => { const sc = $('#gm-scroll') || $('#lb-scroll'); keepScroll = sc ? sc.scrollTop : 0; };
  const restoreScroll = () => { const sc = $('#gm-scroll'); if (sc) sc.scrollTop = keepScroll; };
  const exitBtn = () => `<div class="iconbtn exit" onclick="GAME.exit()" aria-label="Leave the match">${H().I(H().P.door, '#FF8A8E', 22, 2.4)}</div>`;

  function render() {
    const S = L(); if (!S) return;
    saveScroll();
    Object.keys(sig).forEach((k) => delete sig[k]);
    if (S.phase === 'final') { renderFinal(); return; }
    const h = H(); const m = match(); const lg = LEAGUES[m.league];
    screen().innerHTML = `${h.rays}<div class="stadium-lights"><i></i><i></i></div><div class="scroll gm" id="gm-scroll">${h.status}
      <div class="gm-bar"><span class="gm-bar-t">LIVE MATCH</span>${exitBtn()}</div>
      <div class="bc card">
        <div class="bc-top"><span class="lg" style="--dot:${lg.color}">${h.esc(lg.name)}</span><span class="bc-live"><i></i>LIVE</span><button class="speed" onclick="GAME.speed()" id="gm-speed">${S.game.speed}× SPEED</button></div>
        <div class="bc-mid">
          <div class="bc-team">${h.crest(m.home, 52)}<b>${h.esc(TEAMS[m.home][0])}</b></div>
          <div class="bc-score"><div class="digits" id="gm-score">0 : 0</div><span class="clock" id="gm-clock">0'</span></div>
          <div class="bc-team">${h.crest(m.away, 52)}<b>${h.esc(TEAMS[m.away][0])}</b></div>
        </div>
        <div class="tl" id="gm-tl"><span class="tl-ht"></span><span class="tl-fill" id="gm-tlfill"></span><span class="tl-head" id="gm-tlhead"></span><div id="gm-tlgoals"></div></div>
        <div class="tl-lbl"><span>0'</span><span>HT</span><span>90'</span></div>
      </div>
      <div class="pitch" id="gm-pitch">
        <svg viewBox="0 0 340 120" preserveAspectRatio="none"><defs><pattern id="gstripe" width="40" height="120" patternUnits="userSpaceOnUse"><rect width="20" height="120" fill="#1E6B4F"/><rect x="20" width="20" height="120" fill="#22765A"/></pattern></defs>
          <rect width="340" height="120" fill="url(#gstripe)"/><g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"><rect x="4" y="4" width="332" height="112" rx="4"/><path d="M170 4v112"/><circle cx="170" cy="60" r="18"/><rect x="4" y="30" width="40" height="60"/><rect x="296" y="30" width="40" height="60"/><rect x="4" y="46" width="14" height="28"/><rect x="322" y="46" width="14" height="28"/></g></svg>
        <span class="ball" id="gm-ball"></span>
        <div class="pitch-cap" id="gm-cap"></div>
        <div class="goal-burst" id="gm-burst"><b>GOAL!</b></div>
      </div>
      <div id="gm-q"></div>
      <div class="sec"><h2>LIVE LEADERBOARD</h2><span class="sec-note" id="gm-pot"></span></div>
      <div class="lbd card" id="gm-lb"></div>
      <div class="gm-tabs">${[['feed', 'MATCH FEED'], ['chat', 'CHAT'], ['mine', 'MY POINTS']].map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" onclick="GAME.tab('${k}')">${l}</button>`).join('')}</div>
      <div id="gm-tab"></div>
    </div>`;
    update(mt(), true);
    restoreScroll();
  }

  function update(t, force) {
    const S = L(); if (!S || S.phase !== 'live') return;
    const h = H(); const s = scoreAt(t);
    const set = (id, key, html) => { const el = $(`#${id}`); if (el && (force || sig[key] !== html)) { sig[key] = html; el.innerHTML = html; } };
    const sc = $('#gm-score'); if (sc) { const v = `${s[0]} : ${s[1]}`; if (sc.textContent !== v) sc.textContent = v; }
    const ck = $('#gm-clock'); if (ck) ck.textContent = clockLabel(t);
    const pct = Math.min(100, (t / END) * 100);
    const tf = $('#gm-tlfill'); if (tf) tf.style.width = `${pct}%`;
    const th = $('#gm-tlhead'); if (th) th.style.left = `${pct}%`;
    set('gm-tlgoals', 'tlg', EVENTS.filter((e) => e.type === 'goal' && e.t <= t).map((e) => `<span class="tl-goal ${e.team}" style="left:${(e.t / END) * 100}%">⚽</span>`).join(''));
    // pitch: ball drifts toward the attacking side of the last event
    const ball = $('#gm-ball');
    if (ball && (force || !ball.dataset.at || now() - ball.dataset.at > 1800)) {
      ball.dataset.at = now();
      const x = lastAttack === 'H' ? rand(62, 88) : lastAttack === 'A' ? rand(12, 38) : rand(30, 70);
      ball.style.left = `${x}%`; ball.style.top = `${rand(18, 82)}%`;
    }
    const last = EVENTS.filter((e) => e.t <= t).slice(-1)[0];
    set('gm-cap', 'cap', last ? `<span class="ev-min">${minuteLabel(last.t)}</span>${h.esc(fill(last.text))}` : 'Kick-off coming up…');
    set('gm-q', 'q', questionHTML(t));
    const bar = $('#gm-qbar'); const q = QUESTIONS.find((x) => t >= x.open && t < x.close);
    if (bar && q) bar.style.width = `${Math.max(0, (q.close - t) / QUESTION_SECONDS) * 100}%`;
    const qs = $('#gm-qsec'); if (qs && q) qs.textContent = Math.ceil((q.close - t) / S.game.speed);
    set('gm-pot', 'pot', `${h.coinIc(13)} ${h.fmt(LOBBY.h.pot())} pot`);
    set('gm-lb', 'lb', leaderboardHTML(t));
    if (tab === 'feed') set('gm-tab', 'tab-feed', feedHTML(t));
    else if (tab === 'mine') set('gm-tab', 'tab-mine', mineHTML(t));
    else if (tab === 'chat' && (force || !$('#lb-chat'))) {
      sig['tab-feed'] = sig['tab-mine'] = null;
      $('#gm-tab').innerHTML = `<div class="chat card"><div class="chat-list" id="lb-chat">${h.chatHTML()}</div>
        <div class="quick">${h.QUICK.map((x) => `<button onclick="LOBBY.quick(this)">${x}</button>`).join('')}</div>
        <form class="chat-in" id="lb-form"><input id="lb-input" maxlength="140" placeholder="Message your crew…" autocomplete="off"><button type="submit" aria-label="Send">${h.I(h.P.send, '#2B1A04', 20, 2.6)}</button></form></div>`;
      $('#lb-form').onsubmit = (e) => { e.preventDefault(); const inp = $('#lb-input'); h.send(inp.value); inp.value = ''; };
      h.scrollChat();
    }
  }

  function questionHTML(t) {
    const h = H(); const S = L();
    const open = QUESTIONS.find((q) => t >= q.open && t < q.close);
    const pending = QUESTIONS.find((q) => t >= q.close && t < q.res);
    const revealed = QUESTIONS.filter((q) => t >= q.res && t < q.res + 9).slice(-1)[0];
    const my = me().answers || {};
    const asked = QUESTIONS.filter((q) => t >= q.open).length;
    const plate = (txt, cls = '') => `<div class="q-plate ${cls}">${txt}</div>`;
    if (open) {
      const a = my[open.id];
      return `<div class="qcard open ${a ? 'answered' : ''}">${plate(`⚡ LIVE QUESTION · ${minuteLabel(open.open)}`)}
        <p class="q-text">${h.esc(fill(open.text))}</p>
        <div class="q-opts n${open.opts.length}">${open.opts.map(([k, label, pts]) => `<button class="q-opt ${a === k ? 'on' : ''} ${a && a !== k ? 'dim' : ''}" ${a ? 'disabled' : ''} onclick="GAME.answer('${open.id}','${k}')"><span>${h.esc(fill(label))}</span><em>+${pts}</em></button>`).join('')}</div>
        <div class="q-timer"><i id="gm-qbar"></i></div>
        <p class="q-foot">${a ? '🔒 Locked in. Waiting for the result…' : `<b id="gm-qsec">${QUESTION_SECONDS}</b>s left to answer`}</p></div>`;
    }
    if (revealed) {
      const a = my[revealed.id]; const ok = a === revealed.answer; const pts = ok ? revealed.opts.find((o) => o[0] === a)[2] : 0;
      const right = fill(revealed.opts.find((o) => o[0] === revealed.answer)[1]);
      return `<div class="qcard ${ok ? 'win' : 'lose'}">${plate(ok ? `CORRECT! +${pts}` : a ? 'NOT THIS TIME' : 'MISSED IT', ok ? 'green' : 'red')}
        <p class="q-text">${h.esc(fill(revealed.text))}</p>
        <p class="q-res">Answer: <b>${h.esc(right)}</b>${a && !ok ? ` · you said ${h.esc(fill(revealed.opts.find((o) => o[0] === a)[1]))}` : ''}</p>
        ${ok ? '<div class="q-coins"><i></i><i></i><i></i><i></i><i></i></div>' : ''}</div>`;
    }
    if (pending) {
      const a = my[pending.id];
      return `<div class="qcard wait">${plate('⏳ WAITING FOR THE RESULT')}<p class="q-text">${h.esc(fill(pending.text))}</p>
        <p class="q-res">${a ? `Your answer: <b>${h.esc(fill(pending.opts.find((o) => o[0] === a)[1]))}</b>` : 'You did not answer this one.'}</p></div>`;
    }
    const st = points(me(), t);
    return `<div class="qcard idle"><span class="q-bolt">⚡</span><div><b>Live questions pop up when big moments happen</b>
      <small>${asked}/${QUESTIONS.length} asked · ${st.right} right · ${st.live} live pts</small></div></div>`;
  }

  function leaderboardHTML(t) {
    const h = H(); const st = standings(t); const n = st.length; const sp = split(n); const pot = h.pot();
    const ranks = {}; st.forEach((x, i) => { ranks[x.p.name] = i; });
    // remember point changes for the "+N" flash and rank arrows
    st.forEach((x) => {
      const prev = flashes[x.p.name];
      if (prev && x.total > prev.total) flashes[x.p.name] = { total: x.total, gain: x.total - prev.total, until: now() + 3500 };
      else if (!prev) flashes[x.p.name] = { total: x.total, gain: 0, until: 0 };
      else flashes[x.p.name].total = x.total;
    });
    const prevRanks = seenRank || ranks; seenRank = ranks;
    return st.map((x, i) => {
      const f = flashes[x.p.name]; const moved = prevRanks[x.p.name] - i;
      const prize = i < sp.length ? Math.floor((pot * sp[i]) / 100) : 0;
      return `<div class="lr ${x.p.you ? 'me' : ''} ${moved > 0 ? 'up' : ''}">
        <span class="rk r${i + 1}">${i + 1}</span>
        <span class="mini">${PS.animal(x.p.you ? PS.look().animal : x.p.animal)}</span>
        <span class="lr-name"><b>${h.esc(x.p.you ? 'You' : x.p.name)}</b><small>picks ${x.picks} · live ${x.live}</small></span>
        ${prize ? `<span class="lr-prize">${h.coinIc(12)}${h.fmt(prize)}</span>` : '<span></span>'}
        <span class="lr-pts">${x.total}${f && f.until > now() ? `<i class="gain">+${f.gain}</i>` : ''}</span>
      </div>`;
    }).join('');
  }

  const EV_IC = { goal: '⚽', card: '<i class="yc"></i>', corner: '🚩', sub: '🔁', var: '📺', save: '🧤', chance: '🎯', pen: '❗', freekick: '🎯', clear: '🛡️', whistle: '⏱️', info: '⏱️' };
  function feedHTML(t) {
    const h = H();
    const items = [];
    EVENTS.filter((e) => e.t <= t).forEach((e) => items.push({ t: e.t, html: `<div class="ev ${e.type} ${e.team || ''}"><span class="ev-min">${minuteLabel(e.t)}</span><span class="ev-ic">${EV_IC[e.type]}</span><p>${h.esc(fill(e.text))}${e.type === 'goal' ? `<b class="ev-score">${scoreAt(e.t).join(' – ')}</b>` : ''}</p></div>` }));
    QUESTIONS.filter((q) => q.open <= t).forEach((q) => items.push({ t: q.open + 0.1, html: `<div class="ev q"><span class="ev-min">${minuteLabel(q.open)}</span><span class="ev-ic">⚡</span><p>Live question: ${h.esc(fill(q.text))}</p></div>` }));
    return `<div class="feed card">${items.sort((a, b) => b.t - a.t).map((x) => x.html).join('') || '<p class="gm-note">The match is about to start…</p>'}</div>`;
  }

  function mineHTML(t) {
    const h = H(); const p = me(); const st = points(p, t);
    const row = (label, mine, state, pts) => `<div class="mr ${state}"><span class="mr-q">${h.esc(label)}</span><span class="mr-a">${h.esc(mine)}</span><span class="mr-s">${state === 'ok' ? `+${pts}` : state === 'bad' ? '✗' : state === 'miss' ? '–' : '⏳'}</span></div>`;
    const picks = PICKS.map((pk) => {
      const v = p.picks[pk.id]; const lbl = pk.score ? v.replace('-', '–') : fill(pk.opts.find((o) => o[0] === v)[1]);
      return row(pk.text, lbl, t >= pk.res ? (pickCorrect(pk, v) ? 'ok' : 'bad') : 'wait', pk.pts);
    }).join('');
    const live = QUESTIONS.filter((q) => q.open <= t).map((q) => {
      const a = p.answers && p.answers[q.id]; const lbl = a ? fill(q.opts.find((o) => o[0] === a)[1]) : 'No answer';
      const pts = a ? q.opts.find((o) => o[0] === a)[2] : 0;
      return row(fill(q.text), lbl, t < q.res ? (a ? 'wait' : t < q.close ? 'wait' : 'miss') : a === q.answer ? 'ok' : a ? 'bad' : 'miss', pts);
    }).join('');
    const left = QUESTIONS.filter((q) => q.open > t).length;
    return `<div class="mine card">
      <div class="mine-sum"><div><small>PICKS</small><b>${st.picks}</b></div><div><small>LIVE</small><b>${st.live}</b></div><div><small>TOTAL</small><b class="gold">${st.total}</b></div></div>
      <h4>PRE-MATCH PICKS</h4>${picks}
      <h4>LIVE QUESTIONS</h4>${live || '<p class="gm-note">No live questions yet.</p>'}
      ${left ? `<p class="gm-note">${left} more ${left === 1 ? 'question' : 'questions'} to come</p>` : ''}</div>`;
  }

  function celebrate() {
    const b = $('#gm-burst'); if (!b) return;
    b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
  }

  /* =====================================================================
     FINAL (full time)
     ===================================================================== */
  function renderFinal() {
    saveScroll();
    const S = L(); const h = H(); const m = match();
    const st = standings(END); const n = st.length; const sp = split(n); const pot = h.pot();
    const myI = st.findIndex((x) => x.p.you); const mine = st[myI];
    const prize = myI < sp.length ? Math.floor((pot * sp[myI]) / 100) : 0;
    const s = scoreAt(END);
    const podium = [1, 0, 2].filter((i) => st[i]).map((i) => {
      const x = st[i]; const pz = i < sp.length ? Math.floor((pot * sp[i]) / 100) : 0;
      return `<div class="pd pd${i + 1} ${x.p.you ? 'me' : ''}">
        <div class="pd-av">${PS.animal(x.p.you ? PS.look().animal : x.p.animal)}${i === 0 ? '<span class="pd-crown"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M3 18 2 7l5 4 5-7 5 7 5-4-1 11z" fill="#F2B84B" stroke="#1B1230" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="14" r="1.8" fill="#E5484D"/></svg></span>' : ''}</div>
        <b class="pd-name">${h.esc(x.p.you ? 'You' : x.p.name)}</b><span class="pd-pts">${x.total} pts</span>
        <div class="pd-step"><span class="pd-rank">${i + 1}</span>${pz ? `<span class="pd-prize">${h.coinIc(13)}${h.fmt(pz)}</span>` : ''}</div></div>`;
    }).join('');
    const confetti = prize ? `<div class="confetti">${Array.from({ length: 26 }, (_, i) => `<i style="left:${(i * 37) % 100}%;animation-delay:${(i % 9) * 0.25}s;background:${['#F2B84B', '#8BEB6E', '#FF7A7F', '#7FD8FF', '#C9A2FF'][i % 5]}"></i>`).join('')}</div>` : '';
    screen().innerHTML = `${h.rays}${confetti}<div class="scroll gm" id="gm-scroll">${h.status}
      <div class="gm-bar"><span class="gm-bar-t">FULL TIME</span>${exitBtn()}</div>
      <div class="lb-head"><div class="woodsign"><b>FULL TIME</b></div></div>
      <div class="ft-score card">${h.crest(m.home, 40)}<b>${h.esc(TEAMS[m.home][0])}</b><span class="digits">${s[0]} : ${s[1]}</span><b>${h.esc(TEAMS[m.away][0])}</b>${h.crest(m.away, 40)}</div>
      <div class="podium">${podium}</div>
      <div class="ft-me ${prize ? 'won' : ''}">
        <small>YOU FINISHED</small><b>#${myI + 1} <span>of ${n}</span></b>
        <p>${prize ? `You won <strong>${h.fmt(prize)} coins</strong> from the ${h.fmt(pot)} pot!` : 'No prize this time. Better luck next match!'}</p>
      </div>
      <div class="mine card"><div class="mine-sum"><div><small>PICKS</small><b>${mine.picks}</b></div><div><small>LIVE</small><b>${mine.live}</b></div><div><small>RIGHT ANSWERS</small><b>${mine.right}/${QUESTIONS.length}</b></div><div><small>TOTAL</small><b class="gold">${mine.total}</b></div></div></div>
      <div class="sec"><h2>FINAL TABLE</h2><span class="sec-note">${h.coinIc(13)} ${h.fmt(pot)} pot</span></div>
      <div class="lbd card">${st.map((x, i) => `<div class="lr ${x.p.you ? 'me' : ''}"><span class="rk r${i + 1}">${i + 1}</span><span class="mini">${PS.animal(x.p.you ? PS.look().animal : x.p.animal)}</span><span class="lr-name"><b>${h.esc(x.p.you ? 'You' : x.p.name)}</b><small>picks ${x.picks} · live ${x.live}</small></span>${i < sp.length ? `<span class="lr-prize">${h.coinIc(12)}${h.fmt(Math.floor((pot * sp[i]) / 100))}</span>` : '<span></span>'}<span class="lr-pts">${x.total}</span></div>`).join('')}</div>
      ${prize && !S.collected ? `<button class="gm-big pulse" onclick="GAME.collect()">COLLECT ${h.coinIc(22)} ${h.fmt(prize)}</button>` : ''}
      ${!prize || S.collected ? `<button class="gm-big" onclick="GAME.finish()">BACK TO MATCHES</button>` : ''}
      <p class="gm-note">This was a scripted demo match. Real matches will use live data.</p>
    </div>`;
    restoreScroll();
  }
  function collect() {
    const S = L(); if (S.collected) return;
    const st = standings(END); const sp = split(st.length); const myI = st.findIndex((x) => x.p.you);
    const prize = myI < sp.length ? Math.floor((H().pot() * sp[myI]) / 100) : 0;
    S.collected = true; LOBBY.persist();
    if (prize) APP.addCoins(prize);
    if (myI === 0 && window.STATS) STATS.add('wins');
    APP.toast(`+${H().fmt(prize)} coins collected!`);
    renderFinal();
  }
  function finish() {
    const S = L();
    if (!S.collected) {
      // no prize: still count the result
      S.collected = true;
      const st = standings(END); if (st[0] && st[0].p.you && window.STATS) STATS.add('wins');
    }
    hidePush();
    view = null;
    LOBBY.end();
  }

  /* =====================================================================
     public API
     ===================================================================== */
  window.GAME = {
    MAX_PICKS,
    wants: () => !!L() && (L().phase === 'live' || L().phase === 'final' || view === 'picks'),
    show() { if (view === 'picks' && (!L().phase || L().phase === 'waiting')) renderPicks(); else render(); },
    picksCard,
    picksReady: (p) => !!p.picks,
    randomPicks,
    openPicks,
    closePicks() { view = null; LOBBY.rerender(); },
    pick(id, k) { draft[id] = k; renderPicks(); },
    step(side, d) {
      const v = draft.score.split('-').map(Number);
      v[side] = Math.max(0, Math.min(9, v[side] + d));
      draft.score = v.join('-'); renderPicks();
    },
    lockPicks,
    kickoff,
    answer(id, k) {
      const q = QUESTIONS.find((x) => x.id === id); const t = mt();
      if (!q || t < q.open || t >= q.close) return;
      const p = me(); p.answers = p.answers || {};
      if (p.answers[id]) return;
      p.answers[id] = k; LOBBY.persist();
      try { navigator.vibrate && navigator.vibrate(30); } catch (e) { /* not supported */ }
      update(t, true);
    },
    tab(k) { tab = k; render(); },
    speed() {
      const S = L(); const t = mt();
      S.game.base = { real: now(), t }; S.game.speed = S.game.speed === 1 ? 2 : 1; LOBBY.persist();
      const b = $('#gm-speed'); if (b) b.textContent = `${S.game.speed}× SPEED`;
    },
    collect,
    finish,
    exit() {
      const S = L();
      if (S.phase === 'final') { finish(); return; }
      H().sheet('LEAVE THE MATCH?', `<p class="sh-text">The match has started, so your <b>${H().fmt(S.stake)} coins</b> entry stays in the pot and you can't win a prize. Your crew keeps playing without you.</p>
        <div class="sh-btns"><button class="btn stay" onclick="LOBBY.closeSheet()">STAY</button><button class="btn go" onclick="GAME.confirmExit()">LEAVE</button></div>`);
    },
    confirmExit() { H().closeSheet(); hidePush(); view = null; LOBBY.end(); },
    reset() { view = null; lastT = null; seenRank = null; hidePush(); },
  };

  setInterval(tick, 400);
})();
