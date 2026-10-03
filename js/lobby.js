// Lobby waiting room. Opens after "Create lobby" and takes the place of the Matches tab until you leave.
// Demo: invited friends join (or decline) on their own after a few seconds, and they chat back.
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const I = (p, c = '#9FB3BD', s = 24, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const P = {
    door: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8"/><path d="M10 12h11M17 8l4 4-4 4"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
    userplus: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3.1-6 7-6s7 2 7 6"/><path d="M19 8v6M16 11h6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
  };
  const coinIc = (s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F2B84B" stroke="#1B1230" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#B8741F" stroke-width="1.6"/><path d="m12 8 1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="#FFF4C9"/></svg>`;
  const status = `<div class="status"><span>9:41</span><svg width="68" height="12" viewBox="0 0 68 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#fff"/><rect x="5" y="6" width="3" height="6" rx="1" fill="#fff"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#fff"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#fff"/><path d="M25 4.5a9 9 0 0 1 12 0M27.5 7a5.5 5.5 0 0 1 7 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="31" cy="10" r="1.4" fill="#fff"/><rect x="42.5" y=".5" width="22" height="11" rx="3" stroke="#fff" stroke-opacity=".5" fill="none"/><rect x="44.5" y="2.5" width="16" height="7" rx="1.6" fill="#fff"/></svg></div>`;
  const rays = `<div class="rays"><div class="glow"></div><i style="left:40px;width:60px;transform:rotate(18deg)"></i><i style="left:160px;width:40px;transform:rotate(12deg)"></i><i style="left:270px;width:70px;transform:rotate(8deg)"></i></div>`;
  const balance = () => `<div class="bal"><div class="coin"><svg width="16" height="16" viewBox="0 0 24 24"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" fill="#FFF4C9" stroke="#A86E17" stroke-width="1.6"/></svg></div><div><small>Balance</small><b data-bal-num>${APP.fmtBalance()}</b></div><div class="btn-gold topup" data-action="topup">+ Top up</div></div>`;
  const chest = `<svg viewBox="0 0 84 84" width="100%" height="100%"><defs><linearGradient id="lbcb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B57443"/><stop offset="1" stop-color="#6E3D1D"/></linearGradient><linearGradient id="lbcl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98552"/><stop offset="1" stop-color="#8E5129"/></linearGradient></defs>
    <circle cx="42" cy="22" r="9" fill="#FFE59A" stroke="#1B1230" stroke-width="2.2"/><circle cx="30" cy="28" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/><circle cx="54" cy="28" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/>
    <path d="M10 44h64v24a7 7 0 0 1-7 7H17a7 7 0 0 1-7-7z" fill="url(#lbcb)" stroke="#1B1230" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M10 44c0-12 14-18 32-18s32 6 32 18z" fill="url(#lbcl)" stroke="#1B1230" stroke-width="2.6" stroke-linejoin="round"/>
    <rect x="8" y="41" width="68" height="8" rx="3" fill="#F2C14E" stroke="#1B1230" stroke-width="2.4"/><path d="M24 49v24M60 49v24" stroke="#3A1D0B" stroke-width="2.4"/>
    <rect x="35" y="47" width="14" height="15" rx="3.5" fill="#F2C14E" stroke="#1B1230" stroke-width="2.4"/><circle cx="42" cy="54" r="2.2" fill="#1B1230"/></svg>`;
  const fmt = (n) => n.toLocaleString('en-US');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = (m) => APP.toast(m);

  const SEATS = 6;
  const STRANGERS = [['ReefRider', 'crab'], ['GoalFish', 'puffer'], ['Kraken99', 'octopus'], ['CoralKing', 'turtle'], ['TideTiger', 'shark']];
  const JOIN_LINES = ["Let's gooo! ⚽", "I'm in, captain!", 'Easy coins 😎', 'Ahoy crew! 🦈', 'My pick is ready 🔥', 'Who brings the snacks?'];
  const REPLY_LINES = ['Haha true 😂', '100%', "We'll see at kick-off", 'Bring it on!', 'Sharko is with us 🦈', 'No chance 😅', 'Tonight is our night', 'I smell a jackpot 💰'];
  const QUICK = ["LET'S GO! ⚽", '🔥🔥🔥', 'GG', 'Who wins?'];

  /* ---------- state (saved in this browser) ---------- */
  const KEY = 'sharko.lobby.v1';
  let L = null;
  try { L = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { L = null; }
  if (L && !APP.match(L.matchId)) L = null;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(L)); } catch (e) { /* ignore */ } };
  const rand = (a, b) => a + Math.random() * (b - a);
  const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const now = () => Date.now();
  const joined = () => L.players.filter((p) => p.status === 'joined');
  const pot = () => joined().length * L.stake;
  const me = () => L.players.find((p) => p.you);

  function create({ matchId, stake, invited, type = 'Private' }) {
    const friends = PS.friends();
    const t = now();
    const players = [{ name: APP.userName(), you: true, host: true, status: 'joined', animal: PS.look().animal, at: t }];
    invited.slice(0, SEATS - 1).forEach((name) => {
      const f = friends.find((x) => x.name === name) || { name, animal: 'shark', online: true };
      const declines = !f.online && Math.random() < 0.35;
      const delay = f.online ? rand(2500, 8000) : rand(9000, 22000);
      players.push({ name: f.name, animal: f.animal, level: f.level, status: 'invited', outcome: declines ? 'declined' : 'joined', due: t + delay });
    });
    if (type === 'Public') {
      STRANGERS.slice(0, SEATS - players.length).forEach(([name, animal]) => {
        players.push({ name, animal, stranger: true, status: 'invited', outcome: 'joined', due: t + rand(12000, 30000) });
      });
    }
    L = {
      matchId, stake, type, created: t,
      code: Math.random().toString(36).slice(2, 6).toUpperCase(),
      players,
      chat: [{ sys: true, text: 'Lobby created. Share the code with your crew!' }],
    };
    save();
    rendered = false;
    return L.code;
  }

  // Join a friend's lobby (from a code or an invite). You take the next free seat; the host is your friend.
  function join(code, def) {
    const friends = PS.friends();
    const info = (n) => friends.find((f) => f.name === n) || { name: n, animal: 'shark', online: true };
    const t = now();
    const players = def.players.map((n, i) => ({ name: n, animal: info(n).animal, level: info(n).level, host: i === 0, status: 'joined', at: t }));
    players.push({ name: APP.userName(), you: true, status: 'joined', animal: PS.look().animal, at: t });
    def.joining.forEach((n) => players.push({ name: n, animal: info(n).animal, level: info(n).level, status: 'invited', outcome: 'joined', due: t + rand(4000, 12000) }));
    L = {
      matchId: def.match, stake: def.stake, type: 'Private', created: t, code, joinedByCode: true,
      players: players.slice(0, SEATS),
      chat: [{ sys: true, text: `${def.host} created the lobby` }, { from: def.host, animal: info(def.host).animal, text: 'Welcome aboard, crew! 🦈' }, { sys: true, text: `You joined the lobby · +${fmt(def.stake)} to the pot` }],
    };
    save();
    rendered = false;
    const host = players[0];
    setTimeout(() => say(host, `Ahoy ${APP.userName()}! Glad you made it`), 1800);
    return code;
  }

  /* ---------- simulation ---------- */
  let typing = null; // name of a friend who is typing
  function tick() {
    if (!L) return;
    let changed = false;
    L.players.forEach((p) => {
      if (p.status === 'invited' && now() >= p.due) {
        p.status = p.outcome;
        changed = true;
        if (p.status === 'joined') {
          L.chat.push({ sys: true, text: `${p.name} joined the lobby · +${fmt(L.stake)} to the pot` });
          p.justJoined = true;
          if (Math.random() < 0.75) setTimeout(() => say(p, pickOne(JOIN_LINES)), rand(900, 2200));
        } else {
          L.chat.push({ sys: true, text: `${p.name} can't make it this time` });
        }
      }
    });
    if (changed) {
      if (joined().length >= SEATS && !L.fullCounted) { L.fullCounted = true; if (window.STATS) STATS.add('fullHouse'); }
      save(); update();
    }
    const cd = $('#lb-countdown'); if (cd) cd.textContent = countdown();
  }
  function say(p, text) {
    if (!L || p.status !== 'joined') return;
    typing = p.name; drawChat();
    setTimeout(() => {
      typing = null;
      if (!L) return;
      L.chat.push({ from: p.name, animal: p.animal, text });
      save(); drawChat();
    }, rand(700, 1400));
  }
  function send(text) {
    text = text.trim();
    if (!text || !L) return;
    L.chat.push({ from: me().name, you: true, text: text.slice(0, 140) });
    if (window.STATS) STATS.add('chats');
    save(); drawChat();
    const others = joined().filter((p) => !p.you);
    if (others.length && Math.random() < 0.85) setTimeout(() => say(pickOne(others), pickOne(REPLY_LINES)), rand(900, 1800));
  }

  /* ---------- pieces ---------- */
  const crest = (abbr, size) => { const [, c, t] = TEAMS[abbr]; return `<span class="crest" style="--c:${c};--t:${t};--s:${size}px">${abbr}</span>`; };
  function countdown() {
    const m = APP.match(L.matchId);
    let s = Math.max(0, Math.floor((APP.kickoff(m) - now()) / 1000));
    if (s === 0) return 'STARTING';
    if (s > 86400) return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h`;
    const h = String(Math.floor(s / 3600)).padStart(2, '0'); s %= 3600;
    return `${h}:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }
  const avatar = (p) => {
    if (p.you) {
      const look = PS.look();
      return `<div class="glass">${PS.animal(look.animal)}</div><div class="worn-layer">${PS.wearing(look.animal, look.hat, look.eyes, look.extra)}</div>`;
    }
    return `<div class="glass">${PS.animal(p.animal)}</div>`;
  };
  function seatsHTML() {
    const seats = [];
    for (let i = 0; i < SEATS; i++) {
      const p = L.players[i];
      if (!p) { seats.push(`<button class="seat empty" onclick="LOBBY.invite()"><div class="port"><div class="glass water"><span class="bub b1"></span><span class="bub b2"></span><span class="bub b3"></span>${I(P.plus, '#F6D58A', 26, 3)}</div>${bolts}</div><b>Empty seat</b><span class="tag invite">INVITE</span></button>`); continue; }
      const tag = p.status === 'joined' ? (p.host ? '<span class="tag host">HOST</span>' : p.you ? '<span class="tag you">YOU</span>' : '<span class="tag ready">✓ READY</span>')
        : p.status === 'invited' ? '<span class="tag joining">JOINING<i>.</i><i>.</i><i>.</i></span>' : '<span class="tag declined">DECLINED</span>';
      seats.push(`<div class="seat ${p.status} ${p.justJoined ? 'pop' : ''}" ${p.status === 'joined' && !p.you ? `onclick="LOBBY.wave('${esc(p.name)}')"` : ''}>
        <div class="port">${avatar(p)}${bolts}${p.host ? '<span class="crown"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 18 2 7l5 4 5-7 5 7 5-4-1 11z" fill="#F2B84B" stroke="#1B1230" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="14" r="1.8" fill="#E5484D"/></svg></span>' : ''}${p.status === 'invited' ? '<span class="sonar"></span>' : ''}</div>
        <b>${esc(p.you ? 'You' : p.name)}</b>${tag}</div>`);
      p.justJoined = false;
    }
    return seats.join('');
  }
  const bolts = '<i class="bolt n"></i><i class="bolt e"></i><i class="bolt s"></i><i class="bolt w"></i>';
  function potHTML() {
    const n = joined().length; const total = pot();
    const split = n >= 3 ? [60, 30, 10] : [100];
    return `<div class="pot-art">${chest}<span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span></div>
      <div class="pot-info"><small>TOTAL POT</small><b class="pot-num">${coinIc(26)}<span id="lb-pot-num">${fmt(total)}</span></b>
        <p>${n} ${n === 1 ? 'player' : 'players'} × ${fmt(L.stake)} entry</p></div>
      <div class="prizes">${split.map((pct, i) => `<div class="prize p${i + 1}"><span>${['1ST', '2ND', '3RD'][i]}</span><b>${coinIc(13)}${fmt(Math.floor(total * pct / 100))}</b></div>`).join('')}${n < 3 ? '<div class="prize hint">3+ players unlock 2nd &amp; 3rd prizes</div>' : ''}</div>`;
  }
  function boardHTML() {
    const rows = joined();
    return `<div class="tr th"><span>#</span><span>PLAYER</span><span>PICKS</span><span>BONUS</span><span>PTS</span></div>
      ${rows.map((p, i) => `<div class="tr ${p.you ? 'me' : ''}"><span class="rk r${i + 1}">${i + 1}</span><span class="pl"><span class="mini">${PS.animal(p.you ? PS.look().animal : p.animal)}</span>${esc(p.you ? `${p.name} (you)` : p.name)}</span><span>0</span><span>0</span><span class="pts">0</span></div>`).join('')}
      <p class="board-note">${I(P.clock, '#7F95A0', 13, 2.4)} Everyone starts at 0. Points go live at kick-off.</p>`;
  }
  function chatHTML() {
    const msgs = L.chat.slice(-40).map((m) => {
      if (m.sys) return `<div class="msg sys"><span>${esc(m.text)}</span></div>`;
      if (m.you) return `<div class="msg me"><p>${esc(m.text)}</p></div>`;
      return `<div class="msg them"><span class="mini">${PS.animal(m.animal)}</span><div><small>${esc(m.from)}</small><p>${esc(m.text)}</p></div></div>`;
    }).join('');
    return msgs + (typing ? `<div class="msg them typing"><div><small>${esc(typing)}</small><p><i></i><i></i><i></i></p></div></div>` : '');
  }

  /* ---------- render ---------- */
  let rendered = false;
  const screen = () => document.getElementById('screen-lobby');
  function render() {
    const m = APP.match(L.matchId);
    const lg = LEAGUES[m.league];
    const n = joined().length;
    screen().innerHTML = `${rays}<div class="scroll" id="lb-scroll">${status}
      <div class="topbar">${balance()}<div class="iconbtn exit" onclick="LOBBY.leave()" aria-label="Leave lobby">${I(P.door, '#FF8A8E', 22, 2.4)}</div></div>

      <div class="lb-head">
        <div class="woodsign"><b>WAITING ROOM</b></div>
        <div class="lb-meta">
          <span class="live-wait" id="lb-state"></span>
          <button class="code" onclick="LOBBY.copy()">#${L.code} ${I(P.copy, '#F6D58A', 14, 2.4)}</button>
        </div>
      </div>

      <div class="ticket">
        <div class="t-top"><span class="lg" style="--dot:${lg.color}">${esc(lg.name)}</span><span class="t-type">${L.joinedByCode ? `${esc(L.players.find((x) => x.host).name.toUpperCase())}'S LOBBY` : 'YOUR LOBBY'}</span></div>
        <div class="t-teams">
          <div class="t-team">${crest(m.home, 56)}<b>${esc(TEAMS[m.home][0])}</b></div>
          <div class="t-vs"><span>VS</span><small>${esc(APP.whenLabel(m))}</small></div>
          <div class="t-team">${crest(m.away, 56)}<b>${esc(TEAMS[m.away][0])}</b></div>
        </div>
        <div class="t-cut"></div>
        <div class="t-bottom"><span class="venue">${I(P.pin, '#7F95A0', 14, 2.2)} ${esc(m.venue)}</span><span class="kick">KICK-OFF IN <b id="lb-countdown">${countdown()}</b></span></div>
      </div>

      <div class="pot" id="lb-pot">${potHTML()}</div>

      <div class="sec"><h2>CREW <span class="chip" id="lb-count">${n}/${SEATS}</span></h2><button class="link" onclick="LOBBY.invite()">${I(P.userplus, '#F6D58A', 14, 2.6)} Invite</button></div>
      <div class="seatbar" id="lb-seatbar"></div>
      <div class="seats" id="lb-seats">${seatsHTML()}</div>

      <div class="sec"><h2>SCOREBOARD</h2><span class="sec-note">Before kick-off</span></div>
      <div class="board card" id="lb-board">${boardHTML()}</div>

      <div class="sec"><h2>${I(P.chat, '#fff', 18, 2.6)} LOBBY CHAT</h2><span class="sec-note" id="lb-online">${n} in chat</span></div>
      <div class="chat card">
        <div class="chat-list" id="lb-chat">${chatHTML()}</div>
        <div class="quick">${QUICK.map((q) => `<button onclick="LOBBY.quick(this)">${q}</button>`).join('')}</div>
        <form class="chat-in" id="lb-form"><input id="lb-input" maxlength="140" placeholder="Message your crew…" autocomplete="off"><button type="submit" aria-label="Send">${I(P.send, '#2B1A04', 20, 2.6)}</button></form>
      </div>

      <button class="leave" onclick="LOBBY.leave()">${I(P.door, '#FF8A8E', 18, 2.4)} Leave lobby</button>
    </div>`;
    $('#lb-form').onsubmit = (e) => { e.preventDefault(); const inp = $('#lb-input'); send(inp.value); inp.value = ''; };
    rendered = true;
    drawHead(); scrollChat();
  }
  function drawHead() {
    const n = joined().length; const pending = L.players.filter((p) => p.status === 'invited').length;
    const st = $('#lb-state');
    if (st) st.innerHTML = n >= SEATS ? '<i class="dot full"></i>ALL ABOARD!' : pending ? `<i class="dot"></i>WAITING FOR ${pending} ${pending === 1 ? 'PLAYER' : 'PLAYERS'}` : '<i class="dot"></i>WAITING FOR KICK-OFF';
    const c = $('#lb-count'); if (c) c.textContent = `${n}/${SEATS}`;
    const o = $('#lb-online'); if (o) o.textContent = `${n} in chat`;
    const bar = $('#lb-seatbar');
    if (bar) bar.innerHTML = Array.from({ length: SEATS }, (_, i) => { const p = L.players[i]; return `<i class="${p ? p.status : 'empty'}"></i>`; }).join('');
  }
  let shownPot = 0;
  function animatePot() {
    const el = $('#lb-pot-num'); if (!el) return;
    const target = pot(); const from = shownPot; const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 700); el.textContent = fmt(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); };
    if (from !== target) { $('#lb-pot').classList.remove('bump'); void $('#lb-pot').offsetWidth; $('#lb-pot').classList.add('bump'); requestAnimationFrame(step); }
    shownPot = target;
  }
  function update() {
    if (!screen().classList.contains('is-active') || !rendered) return;
    const keep = shownPot;
    $('#lb-pot').innerHTML = potHTML();
    $('#lb-pot-num').textContent = fmt(keep);
    animatePot();
    $('#lb-seats').innerHTML = seatsHTML();
    $('#lb-board').innerHTML = boardHTML();
    drawHead(); drawChat();
  }
  function drawChat() {
    const list = $('#lb-chat'); if (!list) return;
    list.innerHTML = chatHTML(); scrollChat();
  }
  const scrollChat = () => { const list = $('#lb-chat'); if (list) list.scrollTop = list.scrollHeight; };

  /* ---------- sheets (same style as the Profile sheets) ---------- */
  const sheet = (plate, body) => { closeSheet(); screen().insertAdjacentHTML('beforeend', `<div class="dim" onclick="LOBBY.closeSheet()"></div><div class="sheet"><div class="plate">${plate}</div><div class="close" onclick="LOBBY.closeSheet()">${I(P.x, '#fff', 16, 3.2)}</div>${body}</div>`); };
  const closeSheet = () => screen().querySelectorAll('.dim,.sheet').forEach((n) => n.remove());

  window.LOBBY = {
    create,
    join,
    code: () => (L ? L.code : ''),
    isActive: () => !!L,
    onShow() {
      if (!L) return;
      if (!rendered || !screen().innerHTML) { shownPot = pot(); render(); } else update();
      const tab = document.querySelector('#tabbar [data-go="matches"]'); if (tab) tab.classList.add('has-lobby');
    },
    closeSheet,
    copy() {
      const done = () => toast(`Lobby code #${L.code} copied`);
      try { navigator.clipboard.writeText(L.code).then(done, () => toast(`Lobby code: #${L.code}`)); } catch (e) { toast(`Lobby code: #${L.code}`); }
    },
    quick(btn) { send(btn.textContent); },
    wave(name) { send(`👋 ${name}!`); },
    invite() {
      const inLobby = new Set(L.players.map((p) => p.name));
      const free = SEATS - L.players.filter((p) => p.status !== 'declined').length;
      const list = PS.friends().filter((f) => !inLobby.has(f.name)).slice(0, 8);
      sheet('INVITE CREW', `<p class="sh-sub">${free > 0 ? `${free} ${free === 1 ? 'seat' : 'seats'} left in this lobby` : 'The lobby is full'}</p>
        <div class="inv-list">${list.map((f) => `<div class="inv"><span class="mini big">${PS.animal(f.animal)}</span><div class="grow"><b>${esc(f.name)}</b><small>${f.online ? '● Online now' : 'Offline'} · LV ${f.level}</small></div><button class="addbtn" ${free > 0 ? '' : 'disabled'} onclick="LOBBY.add('${esc(f.name)}')">${I(P.userplus, '#fff', 15, 2.8)} INVITE</button></div>`).join('')}</div>`);
    },
    add(name) {
      // a declined seat can be reused
      const di = L.players.findIndex((p) => p.status === 'declined');
      if (di === -1 && L.players.length >= SEATS) { toast('The lobby is full'); return; }
      const f = PS.friends().find((x) => x.name === name);
      const p = { name: f.name, animal: f.animal, level: f.level, status: 'invited', outcome: 'joined', due: now() + (f.online ? rand(2500, 6000) : rand(8000, 15000)) };
      if (di !== -1) L.players.splice(di, 1, p); else L.players.push(p);
      L.chat.push({ sys: true, text: `You invited ${f.name}` });
      if (window.STATS) STATS.add('invites');
      save(); closeSheet(); update(); toast(`Invite sent to ${f.name}`);
    },
    leave() {
      sheet('LEAVE LOBBY?', `<p class="sh-text">The match hasn't started, so your <b>${fmt(L.stake)} coins</b> entry goes back to your balance. Your crew stays in the lobby without you.</p>
        <div class="sh-btns"><button class="btn stay" onclick="LOBBY.closeSheet()">STAY</button><button class="btn go" onclick="LOBBY.confirmLeave()">LEAVE</button></div>`);
    },
    confirmLeave() {
      APP.addCoins(L.stake);
      // The party was not played, so it does not count in your stats.
      if (window.STATS) { STATS.add('matches', -1); if (me().host) STATS.add('hosted', -1); }
      const code = L.code;
      L = null; rendered = false; save();
      screen().innerHTML = '';
      const tab = document.querySelector('#tabbar [data-go="matches"]'); if (tab) tab.classList.remove('has-lobby');
      APP.go('matches');
      toast(`You left lobby #${code}. Entry refunded.`);
    },
  };

  setInterval(tick, 1000);
  if (L) { const tab = document.querySelector('#tabbar [data-go="matches"]'); if (tab) tab.classList.add('has-lobby'); }
})();
