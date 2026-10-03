(() => {
  'use strict';

  // ---------- Icons ----------
  const S = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const ICONS = {
    home: S('<path d="M3.5 10.5 12 3.5l8.5 7V19a1.5 1.5 0 0 1-1.5 1.5h-4.5V15h-5v5.5H5A1.5 1.5 0 0 1 3.5 19z"/>'),
    wallet: S('<path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4h-12A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 18.5 7H5.5A2.5 2.5 0 0 1 3 4.5"/><path d="M16 13.5h.01"/>'),
    swords: S('<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4"/><path d="m7 17-3 3"/><path d="m3 19 2 2"/>'),
    results: S('<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M7.5 9v6M16.5 9v6M12 10.2v.01M12 13.8v.01"/><path d="M9 5V3M15 5V3"/>'),
    key: S('<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M17 6l3 3M14.5 8.5l2 2"/>', 'stroke-width="2.4"'),
    x: S('<path d="M6 6l12 12M18 6 6 18"/>', 'stroke-width="3.2"'),
    check: S('<path d="M5 12.5 10 17 19 7"/>', 'stroke-width="3.4"'),
    userplus: S('<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3.1-6 7-6s7 2 7 6"/><path d="M19 8v6M16 11h6"/>'),
    trophy: S('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),
    bag: S('<path d="M6 7h12l1 13H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>'),
    grid: S('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
    user: S('<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>'),
    bell: S('<path d="M6 8.5a6 6 0 0 1 12 0c0 6.5 2.5 8.5 2.5 8.5h-17S6 15 6 8.5"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0"/>'),
    search: S('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    sliders: S('<path d="M4 7h9"/><path d="M17 7h3"/><path d="M4 17h3"/><path d="M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>', 'stroke-width="2.3"'),
    pin: S('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    plus: S('<path d="M12 5v14M5 12h14"/>', 'stroke-width="3"'),
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
    'chev-left': S('<path d="m15 18-6-6 6-6"/>', 'stroke-width="2.6"'),
    'chev-right': S('<path d="m9 18 6-6-6-6"/>', 'stroke-width="2.6"'),
    volume: S('<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>'),
    globe: S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>'),
    help: S('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.7c0 1.8-2.4 2.3-2.4 3.8"/><path d="M12 17h.01"/>'),
    logout: S('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="m10 17-5-5 5-5"/><path d="M5 12h11"/>'),
    signal: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="15" width="4" height="6" rx="1"/><rect x="8" y="11" width="4" height="10" rx="1"/><rect x="14" y="7" width="4" height="14" rx="1"/><rect x="20" y="3" width="3" height="18" rx="1"/></svg>',
    wifi: S('<path d="M2 9a15 15 0 0 1 20 0"/><path d="M5.5 12.5a10 10 0 0 1 13 0"/><path d="M9 16a5 5 0 0 1 6 0"/><path d="M12 19.5h.01"/>', 'stroke-width="2.6"'),
    battery: '<svg viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1.5" y="6" width="22" height="12" rx="3.5" opacity=".5"/><rect x="3.5" y="8" width="18" height="8" rx="2" fill="currentColor" stroke="none"/><path d="M26 10.5v3" stroke-linecap="round"/></svg>',
  };
  const icon = (name) => `<i data-icon="${name}"></i>`;
  const paintIcons = (root = document) => {
    root.querySelectorAll('i[data-icon]:empty').forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ''; });
  };

  // ---------- State ----------
  const STORE_KEY = 'sharko.demo.v1';
  const state = { balance: 1250, owned: [], notifSeen: false, name: 'CaptainOr' };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved) Object.assign(state, saved);
  } catch (e) { /* storage unavailable: use defaults */ }
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const fmt = (n) => n.toLocaleString('en-US');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Toast ----------
  let toastTimer;
  const toast = (msg) => {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  };

  // ---------- Balance ----------
  const renderBalance = () => {
    $$('[data-balance]').forEach((el) => {
      el.innerHTML = `<span class="coin">${icon('star')}</span>
        <span class="balance-text"><small>Balance</small><b>${fmt(state.balance)}</b></span>
        <button class="btn-gold topup" data-action="topup">+ Top up</button>`;
    });
    $$('[data-bal-num]').forEach((el) => { el.textContent = fmt(state.balance); });
    paintIcons();
  };

  // ---------- Navigation ----------
  const SCREENS = ['home', 'market', 'matches', 'results', 'profile'];
  const go = (name) => {
    if (!SCREENS.includes(name)) name = 'home';
    closeOverlays();
    // While you are in a lobby, the Matches tab shows the lobby waiting room instead of the match list.
    const inLobby = name === 'matches' && window.LOBBY && LOBBY.isActive();
    const shown = inLobby ? 'lobby' : name;
    $$('.screen').forEach((s) => s.classList.toggle('is-active', s.dataset.screen === shown));
    $$('#tabbar button').forEach((b) => b.classList.toggle('is-active', b.dataset.go === name));
    const scr = $(`#screen-${shown}`);
    if (scr && !inLobby) { scr.scrollTop = 0; const inner = $('.scroll', scr); if (inner) inner.scrollTop = 0; }
    $('#phone').classList.toggle('on-home', name === 'home');
    $('#phone').classList.toggle('own-status', inLobby || name === 'results' || name === 'profile' || name === 'market');
    if (inLobby) LOBBY.onShow();
    if (name === 'market' && window.MK) MK.render();
    if (name === 'profile' && window.PS && PS.refresh) PS.refresh();
    if (location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
  };

  // ---------- Sheet ----------
  const openSheet = (plate, html, onMount) => {
    $('#sheet-body').innerHTML = `<div class="ds-plate">${plate}</div><button class="ds-close" type="button" aria-label="Close">${icon('x')}</button>${html}`;
    $('#sheet-body .ds-close').onclick = () => closeSheet();
    paintIcons($('#sheet'));
    $('#sheet').hidden = false;
    $('#sheet-scrim').hidden = false;
    if (onMount) onMount($('#sheet-body'));
  };
  const closeSheet = () => { $('#sheet').hidden = true; $('#sheet-scrim').hidden = true; };
  const closeOverlays = () => {
    closeSheet(); closeFilters(false); $('#notif-pop').hidden = true;
    $$('.screen .dim, .screen .sheet').forEach((n) => n.remove());
  };

  // ---------- Treasure chest art (shared by Top up and the Market) ----------
  const chestArt = (coins) => `<svg viewBox="0 0 84 84" width="100%" height="100%"><defs><linearGradient id="cb${coins}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B57443"/><stop offset="1" stop-color="#6E3D1D"/></linearGradient><linearGradient id="cl${coins}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98552"/><stop offset="1" stop-color="#8E5129"/></linearGradient></defs>
    ${coins >= 1200 ? '<circle cx="24" cy="30" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/><circle cx="60" cy="28" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/>' : ''}
    ${coins >= 2600 ? '<circle cx="42" cy="20" r="9" fill="#FFE59A" stroke="#1B1230" stroke-width="2.2"/><circle cx="34" cy="26" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/><circle cx="50" cy="26" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/>' : ''}
    ${coins >= 7000 ? '<path d="M30 14l4-8 4 6 4-8 4 8 4-6 4 8z" fill="#F2B84B" stroke="#1B1230" stroke-width="2" stroke-linejoin="round"/>' : ''}
    <path d="M10 44h64v24a7 7 0 0 1-7 7H17a7 7 0 0 1-7-7z" fill="url(#cb${coins})" stroke="#1B1230" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M10 44c0-12 14-18 32-18s32 6 32 18z" fill="url(#cl${coins})" stroke="#1B1230" stroke-width="2.6" stroke-linejoin="round"/>
    <rect x="8" y="41" width="68" height="8" rx="3" fill="#F2C14E" stroke="#1B1230" stroke-width="2.4"/>
    <path d="M24 49v24M60 49v24" stroke="#3A1D0B" stroke-width="2.4"/>
    <rect x="35" y="47" width="14" height="15" rx="3.5" fill="#F2C14E" stroke="#1B1230" stroke-width="2.4"/><circle cx="42" cy="54" r="2.2" fill="#1B1230"/>
    <path d="M18 34q8-5 18-6" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  const coinIc = (sz = 14) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F2B84B" stroke="#1B1230" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#B8741F" stroke-width="1.6"/><path d="m12 8 1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="#FFF4C9"/></svg>`;
  const buyPack = (i) => {
    const p = COIN_PACKS[i];
    state.balance += p.coins; save(); renderBalance();
    toast(`+${fmt(p.coins)} coins from the ${p.name} (demo, no charge)`);
  };
  const packsHTML = () => COIN_PACKS.map((p, i) => `<button class="ds-pack" data-pack="${i}">${p.tag ? `<span class="ds-tag ${p.tag === 'BEST' ? 'best' : ''}">${p.tag}</span>` : ''}
      <span class="ds-chest">${chestArt(p.coins)}</span><b>${coinIc(15)}${fmt(p.coins)}</b><small>${p.name}</small><span class="ds-price">${p.price}</span></button>`).join('');

  // ---------- Top up ----------
  const openTopUp = () => {
    openSheet('TOP UP', `
      <p class="ds-sub">Your balance: <b>${coinIc(14)} ${fmt(state.balance)}</b></p>
      <div class="ds-packs">${packsHTML()}</div>
      <p class="ds-note">Same chests as in the Market. Demo store, nothing is charged.</p>`, (body) => {
      body.querySelectorAll('[data-pack]').forEach((b) => { b.onclick = () => { buyPack(+b.dataset.pack); closeSheet(); }; });
    });
  };

  // ---------- Notifications ----------
  const renderBell = () => { $('#bell-badge').hidden = state.notifSeen; };
  const toggleNotifs = () => {
    const pop = $('#notif-pop');
    if (!pop.hidden) { pop.hidden = true; return; }
    const kind = (a) => (a.startsWith('lobby:') ? ['invite', 'userplus'] : a === 'results' ? ['win', 'trophy'] : ['deal', 'bag']);
    pop.innerHTML = `<div class="np-head"><h3>Notifications</h3><span>${NOTIFICATIONS.length}</span></div>` + NOTIFICATIONS.map(([t, sub, ago, act], i) => {
      const [k, ic] = kind(act);
      return `<button class="notif ${k}" data-notif="${i}"><span class="n-ic">${icon(ic)}</span><span class="n-txt"><b>${esc(t)}</b><small>${esc(sub)}</small></span><span class="n-side"><time>${ago}</time>${k === 'invite' ? '<em>VIEW</em>' : '<i class="n-chev">›</i>'}</span></button>`;
    }).join('');
    paintIcons(pop);
    pop.querySelectorAll('[data-notif]').forEach((b) => {
      b.onclick = () => {
        const act = NOTIFICATIONS[+b.dataset.notif][3];
        pop.hidden = true;
        if (act.startsWith('lobby:')) previewLobby(act.slice(6));
        else go(act);
      };
    });
    pop.hidden = false;
    state.notifSeen = true; save(); renderBell();
  };

  // ---------- Home guide carousel ----------
  let guideIdx = 0;
  let guideTimer;
  const renderGuide = (animate = true) => {
    const [rawTitle, text] = GUIDE_LINES[guideIdx];
    const title = rawTitle.replace('CaptainOr', state.name);
    const bubble = $('#guide-bubble');
    const apply = () => {
      $('#guide-title').textContent = title;
      $('#guide-text').textContent = text;
      bubble.classList.remove('swap');
    };
    if (animate) { bubble.classList.add('swap'); setTimeout(apply, 180); } else apply();
    $$('#guide-dots button').forEach((d, i) => d.classList.toggle('is-active', i === guideIdx));
  };
  const stepGuide = (dir) => {
    guideIdx = (guideIdx + dir + GUIDE_LINES.length) % GUIDE_LINES.length;
    renderGuide();
    restartGuideTimer();
  };
  const restartGuideTimer = () => {
    clearInterval(guideTimer);
    guideTimer = setInterval(() => {
      if ($('#screen-home').classList.contains('is-active')) { guideIdx = (guideIdx + 1) % GUIDE_LINES.length; renderGuide(); }
    }, 6000);
  };
  const initGuide = () => {
    $('#guide-dots').innerHTML = GUIDE_LINES.map((_, i) => `<button aria-label="Tip ${i + 1}" data-dot="${i}"></button>`).join('');
    $('#guide-dots').addEventListener('click', (e) => {
      const d = e.target.closest('[data-dot]');
      if (d) { guideIdx = +d.dataset.dot; renderGuide(); restartGuideTimer(); }
    });
    $('#guide-prev').addEventListener('click', () => stepGuide(-1));
    $('#guide-next').addEventListener('click', () => stepGuide(1));
    renderGuide(false);
    restartGuideTimer();
  };

  // ---------- Dates ----------
  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
  const upcomingLabel = (offset, time) => {
    if (offset === 0) return `Today ${time}`;
    if (offset === 1) return `Tomorrow ${time}`;
    const d = dayFromNow(offset);
    return offset < 7 ? `${WEEKDAYS[d.getDay()]} ${time}` : `${d.getDate()} ${MONTHS[d.getMonth()]} ${time}`;
  };
  const pastLabel = (ago) => {
    if (ago === 1) return 'Yesterday';
    const d = dayFromNow(-ago);
    return ago < 7 ? WEEKDAYS[d.getDay()] : `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  };

  // ---------- Shared card pieces ----------
  const crest = (abbr) => {
    const [, color, text] = TEAMS[abbr];
    return `<span class="crest" style="--c:${color};--t:${text}">${abbr}</span>`;
  };
  const team = (abbr) => `<div class="team">${crest(abbr)}<span>${esc(TEAMS[abbr][0])}</span></div>`;
  const leagueTag = (key) => `<span class="league" style="--dot:${LEAGUES[key].color}">${esc(LEAGUES[key].name)}</span>`;

  // ---------- Matches ----------
  const nextWeekday = (dow) => (dow - new Date().getDay() + 7) % 7;
  const resolveDay = (d) => (d === 'sat' ? nextWeekday(6) : d === 'sun' ? nextWeekday(0) : d);
  const MATCHES = FIXTURES
    .map(([league, home, away, day, time], i) => ({ league, home, away, offset: resolveDay(day), time, venue: TEAMS[home][3], featured: i < FEATURED.length, order: i }))
    .sort((a, b) => (b.featured - a.featured) || (a.featured ? a.order - b.order : (a.offset - b.offset) || a.time.localeCompare(b.time)))
    .map((m, id) => ({ ...m, id }));
  const COUNTRIES = ['England', 'Spain', 'Israel', 'Italy', 'Germany'];
  // Same buttons as the design (Bundesliga matches still show under Germany).
  const LEAGUE_KEYS = ['epl', 'laliga', 'ligat', 'seriea', 'ucl'];
  const WHEN = [['today', 'Today'], ['tomorrow', 'Tomorrow'], ['week', 'This week'], ['any', 'Any time']];

  const filters = { country: new Set(), league: new Set(), when: 'any' };
  // The first time the panel opens it shows the example selection from the design.
  let firstOpen = true;
  let draft = null;
  let query = '';

  const applyFilters = (f, q) => MATCHES.filter((m) => {
    const lg = LEAGUES[m.league];
    if (f.country.size && !f.country.has(lg.country)) return false;
    if (f.league.size && !f.league.has(m.league)) return false;
    if (f.when === 'today' && m.offset !== 0) return false;
    if (f.when === 'tomorrow' && m.offset !== 1) return false;
    if (f.when === 'week' && m.offset > 6) return false;
    if (q) {
      const hay = [TEAMS[m.home][0], TEAMS[m.away][0], m.home, m.away, lg.name, lg.country, m.venue].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const renderMatches = () => {
    const list = applyFilters(filters, query);
    $('#match-count').textContent = list.length;
    const active = filters.country.size + filters.league.size + (filters.when !== 'any' ? 1 : 0);
    const fc = $('#filter-count');
    fc.hidden = !active; fc.textContent = active;
    $('#match-list').innerHTML = list.length ? list.map((m) => `
      <article class="match-card">
        <button class="btn-gold lobby-btn" data-lobby="${m.id}"><span class="plus">${icon('plus')}</span>Create<br>Lobby</button>
        <div class="mc-body">
          <div class="mc-top">${leagueTag(m.league)}<span class="when-chip">${upcomingLabel(m.offset, m.time)}</span></div>
          <div class="teams">${team(m.home)}<span class="vs">VS</span>${team(m.away)}</div>
          <div class="venue">${icon('pin')}<span>${esc(m.venue)}</span></div>
        </div>
      </article>`).join('')
      : `<div class="empty"><b>No matches found</b>Try another search or reset the filters.</div>`;
    paintIcons($('#match-list'));
  };

  const chip = (label, on, attrs) => `<button class="chip${on ? ' is-on' : ''}" ${attrs}>${esc(label)}</button>`;
  const renderFilterPanel = () => {
    $('#chips-country').innerHTML = chip('All', !draft.country.size, 'data-country=""') +
      COUNTRIES.map((c) => chip(c, draft.country.has(c), `data-country="${c}"`)).join('');
    $('#chips-league').innerHTML = LEAGUE_KEYS.map((k) => chip(LEAGUES[k].name, draft.league.has(k), `data-league="${k}"`)).join('');
    $('#chips-when').innerHTML = WHEN.map(([k, l]) => chip(l, draft.when === k, `data-when="${k}"`)).join('');
    const n = applyFilters(draft, query).length;
    $('#filter-apply').textContent = `Show ${n} ${n === 1 ? 'match' : 'matches'}`;
  };

  const openFilters = () => {
    const screen = $('#screen-matches');
    screen.scrollTop = 0;
    draft = firstOpen
      ? { country: new Set(['England', 'Israel']), league: new Set(['epl']), when: 'week' }
      : { country: new Set(filters.country), league: new Set(filters.league), when: filters.when };
    firstOpen = false;
    renderFilterPanel();
    $('#filter-panel').hidden = false;
    $('#filter-scrim').hidden = false;
    $('#filter-btn').setAttribute('aria-expanded', 'true');
    screen.style.overflowY = 'hidden';
  };
  function closeFilters(apply) {
    if (apply && draft) {
      filters.country = draft.country; filters.league = draft.league; filters.when = draft.when;
      renderMatches();
    }
    draft = null;
    $('#filter-panel').hidden = true;
    $('#filter-scrim').hidden = true;
    $('#filter-btn').setAttribute('aria-expanded', 'false');
    $('#screen-matches').style.overflowY = '';
  }

  const initMatches = () => {
    $('#join-code-btn').addEventListener('click', () => openJoinCode());
    $('#search-input').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); renderMatches(); });
    $('#filter-btn').addEventListener('click', () => ($('#filter-panel').hidden ? openFilters() : closeFilters(false)));
    $('#filter-scrim').addEventListener('click', () => closeFilters(false));
    $('#filter-apply').addEventListener('click', () => closeFilters(true));
    $('#filter-reset').addEventListener('click', () => { draft = { country: new Set(), league: new Set(), when: 'any' }; renderFilterPanel(); });
    $('#filter-panel').addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b || !draft) return;
      if ('country' in b.dataset) {
        const c = b.dataset.country;
        if (!c) draft.country.clear();
        else draft.country.has(c) ? draft.country.delete(c) : draft.country.add(c);
      } else if ('league' in b.dataset) {
        const k = b.dataset.league;
        draft.league.has(k) ? draft.league.delete(k) : draft.league.add(k);
      } else if ('when' in b.dataset) {
        draft.when = b.dataset.when;
      }
      renderFilterPanel();
    });
    $('#match-list').addEventListener('click', (e) => {
      const b = e.target.closest('[data-lobby]');
      if (b) openLobby(MATCHES[+b.dataset.lobby]);
    });
    renderMatches();
  };

  // ---------- Create lobby ----------
  const STAKES = [100, 250, 500, 1000];
  const alreadyInLobby = () => {
    if (window.LOBBY && LOBBY.isActive()) { toast(`You're already in lobby #${LOBBY.code()}. Leave it first.`); go('matches'); return true; }
    return false;
  };
  const openLobby = (m) => {
    if (alreadyInLobby()) return;
    const friends = window.PS && PS.friends ? PS.friends().slice(0, 8) : CREW.map((n) => ({ name: n, online: true, animal: 'shark' }));
    const MAX_INVITES = 5; // 6 seats: you + 5 friends
    const lobby = { stake: 250, crew: new Set(friends.filter((f) => f.online).slice(0, 3).map((f) => f.name)) };
    const av = (k) => (window.PS && PS.animal ? PS.animal(k) : '');
    const render = (body) => {
      body.querySelector('.ds-body').innerHTML = `
        <p class="ds-sub">${esc(LEAGUES[m.league].name)} · ${upcomingLabel(m.offset, m.time)}</p>
        <div class="sheet-match">${team(m.home)}<span class="vs">VS</span>${team(m.away)}</div>
        <h4 class="ds-h">ENTRY PER PLAYER</h4>
        <div class="ds-stakes">${STAKES.map((v) => `<button class="ds-stake ${lobby.stake === v ? 'on' : ''}" data-stake="${v}">${coinIc(16)}${fmt(v)}</button>`).join('')}</div>
        <h4 class="ds-h">INVITE YOUR CREW <span class="ds-count">${lobby.crew.size}/${MAX_INVITES}</span></h4>
        <div class="ds-crew">${friends.map((f) => `<button class="ds-mate ${lobby.crew.has(f.name) ? 'on' : ''}" data-crew="${esc(f.name)}"><span class="ds-av">${av(f.animal)}${f.online ? '<i class="ds-on"></i>' : ''}${lobby.crew.has(f.name) ? `<i class="ds-tick">${icon('check')}</i>` : ''}</span><span>${esc(f.name)}</span></button>`).join('')}</div>
        <p class="ds-hint">${icon('key')} Private lobby. Friends join with your lobby code.</p>
        <button class="ds-big" data-create>CREATE LOBBY · ${coinIc(20)} ${fmt(lobby.stake)}</button>
        <p class="ds-note">Your balance: ${fmt(state.balance)} coins</p>`;
      paintIcons(body);
    };
    openSheet('CREATE LOBBY', '<div class="ds-body"></div>', (body) => {
      render(body);
      body.querySelector('.ds-body').onclick = (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.stake) lobby.stake = +b.dataset.stake;
        else if (b.dataset.crew) {
          const c = b.dataset.crew;
          if (lobby.crew.has(c)) lobby.crew.delete(c);
          else if (lobby.crew.size >= MAX_INVITES) { toast('The lobby has 6 seats. Remove someone first.'); return; }
          else lobby.crew.add(c);
        } else if ('create' in b.dataset) {
          if (state.balance < lobby.stake) { toast('Not enough coins. Top up to create this lobby.'); return; }
          state.balance -= lobby.stake; save(); renderBalance(); closeSheet();
          const code = LOBBY.create({ matchId: m.id, stake: lobby.stake, invited: [...lobby.crew] });
          if (window.STATS) { STATS.add('hosted'); STATS.add('matches'); STATS.add('invites', lobby.crew.size); if (lobby.stake >= 1000) STATS.add('highRoller'); }
          go('matches');
          toast(`Lobby #${code} created · waiting for your crew`);
          return;
        }
        render(body);
      };
    });
  };

  // ---------- Join a friend's lobby with a code ----------
  const openJoinCode = (prefill = '') => {
    if (alreadyInLobby()) return;
    openSheet('JOIN A LOBBY', `
      <p class="ds-sub">Enter the code your friend sent you.</p>
      <form class="ds-codeform" id="join-form" novalidate>
        <input id="join-code" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABCD" value="${esc(prefill)}" aria-label="Lobby code">
        <p class="ds-err" id="join-err"></p>
        <button class="ds-big" type="submit">${icon('key')} FIND LOBBY</button>
      </form>
      <p class="ds-note">Codes come with an invite in your notifications (the bell on Home).</p>`, (body) => {
      paintIcons(body);
      const inp = body.querySelector('#join-code');
      inp.oninput = () => { inp.value = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); body.querySelector('#join-err').textContent = ''; };
      setTimeout(() => inp.focus(), 50);
      body.querySelector('#join-form').onsubmit = (e) => {
        e.preventDefault();
        const code = inp.value.trim().toUpperCase();
        const err = body.querySelector('#join-err');
        if (code.length !== 4) { err.textContent = 'Lobby codes have 4 characters.'; return; }
        if (!FRIEND_LOBBIES[code]) { err.textContent = `No lobby found with code #${code}. Check the code and try again.`; return; }
        previewLobby(code);
      };
    });
  };
  const previewLobby = (code) => {
    if (alreadyInLobby()) return;
    const def = FRIEND_LOBBIES[code];
    const m = MATCHES[def.match];
    const fr = window.PS && PS.friends ? PS.friends() : [];
    const animalOf = (n) => (fr.find((f) => f.name === n) || { animal: 'shark' }).animal;
    const av = (n) => (window.PS && PS.animal ? PS.animal(animalOf(n)) : '');
    const count = def.players.length;
    openSheet(`${esc(def.host.toUpperCase())}'S LOBBY`, `
      <p class="ds-sub">${esc(LEAGUES[m.league].name)} · ${upcomingLabel(m.offset, m.time)} · <b class="ds-code">#${code}</b></p>
      <div class="sheet-match">${team(m.home)}<span class="vs">VS</span>${team(m.away)}</div>
      <h4 class="ds-h">CREW <span class="ds-count">${count}/6</span></h4>
      <div class="ds-crew">${def.players.map((n) => `<div class="ds-mate on"><span class="ds-av">${av(n)}${n === def.host ? '<i class="ds-host">HOST</i>' : ''}</span><span>${esc(n)}</span></div>`).join('')}
        ${def.joining.map((n) => `<div class="ds-mate wait"><span class="ds-av">${av(n)}</span><span>${esc(n)}</span></div>`).join('')}
        <div class="ds-mate you"><span class="ds-av ds-seat">${icon('userplus')}</span><span>You</span></div></div>
      <div class="ds-row"><div><small>ENTRY</small><b>${coinIc(16)} ${fmt(def.stake)}</b></div><div><small>POT SO FAR</small><b>${coinIc(16)} ${fmt(def.stake * count)}</b></div></div>
      <button class="ds-big" id="join-go">JOIN · ${coinIc(20)} ${fmt(def.stake)}</button>
      <p class="ds-note">Your balance: ${fmt(state.balance)} coins</p>`, (body) => {
      paintIcons(body);
      body.querySelector('#join-go').onclick = () => {
        if (state.balance < def.stake) { closeSheet(); toast('Not enough coins to join. Top up first.'); openTopUp(); return; }
        state.balance -= def.stake; save(); renderBalance(); closeSheet();
        LOBBY.join(code, def);
        if (window.STATS) { STATS.add('matches'); STATS.add('joinedByCode'); if (def.stake >= 1000) STATS.add('highRoller'); }
        go('matches');
        toast(`You joined ${def.host}'s lobby #${code}`);
      };
    });
  };

  // ---------- Fit the 390 x 844 phone canvas to the window ----------
  const fit = () => {
    const phone = $('#phone');
    const framed = innerWidth >= 600 && innerHeight >= 500;
    phone.classList.toggle('framed', framed);
    const pad = framed ? 56 : 0;
    let s = Math.min((innerWidth - pad) / 390, (innerHeight - pad) / 844);
    if (framed) s = Math.min(1, s);
    phone.style.transform = `scale(${s})`;
  };
  window.addEventListener('resize', fit);
  fit();

  // ---------- Global wiring ----------
  document.addEventListener('click', (e) => {
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) { go(goBtn.dataset.go); return; }
    if (e.target.closest('[data-action="topup"]')) { $('#notif-pop').hidden = true; openTopUp(); return; }
    const t = e.target.closest('[data-toast]');
    if (t) { toast(t.dataset.toast); return; }
    if (e.target.closest('#bell-btn')) { toggleNotifs(); return; }
    if (!e.target.closest('#notif-pop')) $('#notif-pop').hidden = true;
  });
  $('#sheet-scrim').addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlays(); });
  window.addEventListener('hashchange', () => go(location.hash.slice(1)));

  // Shared helpers for the Results and Profile screens.
  window.APP = {
    toast, go, refreshBalance: renderBalance, fmtBalance: () => fmt(state.balance),
    userName: () => state.name,
    setUser(name) { state.name = name; save(); renderGuide(false); if (window.PS) PS.openProfile(); },
    addCoins(n) { state.balance += n; save(); renderBalance(); },
    balance: () => state.balance,
    spend(n) { if (state.balance < n) return false; state.balance -= n; save(); renderBalance(); return true; },
    topUp: () => openTopUp(),
    chestArt, packs: () => COIN_PACKS, buyPack, joinCode: openJoinCode,
    match: (id) => MATCHES[id],
    whenLabel: (m) => upcomingLabel(m.offset, m.time),
    kickoff(m) { const d = new Date(); d.setDate(d.getDate() + m.offset); const [h, mi] = m.time.split(':'); d.setHours(+h, +mi, 0, 0); return d; },
  };

  paintIcons();
  renderBalance();
  renderBell();
  initGuide();
  initMatches();
  go(location.hash.slice(1) || 'home');
})();
