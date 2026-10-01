(() => {
  'use strict';

  // ---------- Icons ----------
  const S = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const ICONS = {
    home: S('<path d="M3.5 10.5 12 3.5l8.5 7V19a1.5 1.5 0 0 1-1.5 1.5h-4.5V15h-5v5.5H5A1.5 1.5 0 0 1 3.5 19z"/>'),
    wallet: S('<path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4h-12A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 18.5 7H5.5A2.5 2.5 0 0 1 3 4.5"/><path d="M16 13.5h.01"/>'),
    swords: S('<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4"/><path d="m7 17-3 3"/><path d="m3 19 2 2"/>'),
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
  const state = { balance: 1250, owned: [], notifSeen: false };
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
    paintIcons();
  };

  // ---------- Navigation ----------
  const SCREENS = ['home', 'market', 'matches', 'results', 'profile'];
  const go = (name) => {
    if (!SCREENS.includes(name)) name = 'home';
    closeOverlays();
    $$('.screen').forEach((s) => s.classList.toggle('is-active', s.dataset.screen === name));
    $$('#tabbar button').forEach((b) => b.classList.toggle('is-active', b.dataset.go === name));
    const scr = $(`#screen-${name}`);
    if (scr) scr.scrollTop = 0;
    if (location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
  };

  // ---------- Sheet ----------
  const openSheet = (html, onMount) => {
    $('#sheet-body').innerHTML = html;
    paintIcons($('#sheet'));
    $('#sheet').hidden = false;
    $('#sheet-scrim').hidden = false;
    if (onMount) onMount($('#sheet-body'));
  };
  const closeSheet = () => { $('#sheet').hidden = true; $('#sheet-scrim').hidden = true; };
  const closeOverlays = () => { closeSheet(); closeFilters(false); $('#notif-pop').hidden = true; };

  // ---------- Top up ----------
  const openTopUp = () => {
    openSheet(`
      <h3>Top up</h3>
      <p class="sub">Add coins to your balance. Demo only, no payment is taken.</p>
      <div class="packs">
        ${COIN_PACKS.map((p, i) => `
          <div class="pack">
            ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
            <span class="coin">${icon('star')}</span>
            <b>${fmt(p.coins)}</b>
            <button class="btn-gold" data-pack="${i}">${p.price}</button>
          </div>`).join('')}
      </div>`, (body) => {
      body.addEventListener('click', (e) => {
        const b = e.target.closest('[data-pack]');
        if (!b) return;
        const p = COIN_PACKS[+b.dataset.pack];
        state.balance += p.coins; save(); renderBalance(); closeSheet();
        toast(`+${fmt(p.coins)} coins added`);
      });
    });
  };

  // ---------- Notifications ----------
  const renderBell = () => { $('#bell-badge').hidden = state.notifSeen; };
  const toggleNotifs = () => {
    const pop = $('#notif-pop');
    if (!pop.hidden) { pop.hidden = true; return; }
    pop.innerHTML = `<h3>Notifications</h3>` + NOTIFICATIONS.map(([t, s, ago]) =>
      `<div class="notif"><b>${esc(t)}</b><time>${ago}</time><small>${esc(s)}</small></div>`).join('');
    pop.hidden = false;
    state.notifSeen = true; save(); renderBell();
  };

  // ---------- Home guide carousel ----------
  let guideIdx = 0;
  let guideTimer;
  const renderGuide = (animate = true) => {
    const [title, text] = GUIDE_LINES[guideIdx];
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
  const MATCHES = FIXTURES.map(([league, home, away, offset, time], id) => ({
    id, league, home, away, offset, time, venue: TEAMS[home][3],
  }));
  const COUNTRIES = ['England', 'Spain', 'Israel', 'Italy', 'Germany'];
  const LEAGUE_KEYS = ['epl', 'laliga', 'ligat', 'seriea', 'bundes', 'ucl'];
  const WHEN = [['today', 'Today'], ['tomorrow', 'Tomorrow'], ['week', 'This week'], ['any', 'Any time']];

  const filters = { country: new Set(), league: new Set(), when: 'any' };
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
    draft = { country: new Set(filters.country), league: new Set(filters.league), when: filters.when };
    const row = $('.search-row', screen);
    $('#filter-panel').style.top = `${row.offsetTop + row.offsetHeight + 12}px`;
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
  const openLobby = (m) => {
    const lobby = { stake: 250, type: 'Private', crew: new Set(['Noa', 'Dan']) };
    const render = (body) => {
      body.innerHTML = `
        <h3>Create lobby</h3>
        <p class="sub">${esc(LEAGUES[m.league].name)} · ${upcomingLabel(m.offset, m.time)}</p>
        <div class="sheet-match">${team(m.home)}<span class="vs">VS</span>${team(m.away)}</div>
        <h4>Entry per player</h4>
        <div class="chips">${STAKES.map((s) => chip(`${fmt(s)} coins`, lobby.stake === s, `data-stake="${s}"`)).join('')}</div>
        <h4>Lobby type</h4>
        <div class="chips">${['Private', 'Public'].map((t) => chip(t, lobby.type === t, `data-type="${t}"`)).join('')}</div>
        <h4>Invite your crew</h4>
        <div class="chips">${CREW.map((c) => chip(c, lobby.crew.has(c), `data-crew="${c}"`)).join('')}</div>
        <button class="btn-gold cta" data-create>Create lobby · ${fmt(lobby.stake)}</button>
        <p class="note">Your balance: ${fmt(state.balance)} coins</p>`;
    };
    openSheet('', (body) => {
      render(body);
      body.onclick = (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.stake) lobby.stake = +b.dataset.stake;
        else if (b.dataset.type) lobby.type = b.dataset.type;
        else if (b.dataset.crew) { const c = b.dataset.crew; lobby.crew.has(c) ? lobby.crew.delete(c) : lobby.crew.add(c); }
        else if ('create' in b.dataset) {
          if (state.balance < lobby.stake) { toast('Not enough coins. Top up to join this lobby.'); return; }
          state.balance -= lobby.stake; save(); renderBalance(); closeSheet();
          const code = Math.random().toString(36).slice(2, 6).toUpperCase();
          const invited = lobby.crew.size ? ` · ${lobby.crew.size} invited` : '';
          toast(`Lobby ${code} created${invited}`);
          return;
        }
        render(body);
      };
    });
  };

  // ---------- Market ----------
  const renderMarket = () => {
    $('#deals').innerHTML = DEALS.map((d) => {
      const owned = state.owned.includes(d.id);
      return `
        <button class="deal${owned ? ' is-owned' : ''}" data-deal="${d.id}" aria-label="${esc(d.name)}, ${owned ? 'owned' : d.price}">
          <img class="deal-img" src="${d.img}" alt="">
          <div class="pedestal"><div class="pedestal-top"></div><div class="pedestal-front"><span class="price">${owned ? 'Owned' : d.price}</span></div></div>
          <span class="deal-name">${esc(d.name)}</span>
        </button>`;
    }).join('');
  };
  const openDeal = (d) => {
    const owned = state.owned.includes(d.id);
    openSheet(`
      <div class="item-preview">
        <img src="${d.img}" alt="">
        <h3>${esc(d.name)}</h3>
        <p class="sub">Daily Deal · cosmetic for your avatar</p>
      </div>
      <button class="btn-gold cta" data-buy ${owned ? 'disabled' : ''}>${owned ? 'Already owned' : `Buy for ${d.price}`}</button>
      <p class="note">Demo store. Nothing is charged.</p>`, (body) => {
      const b = $('[data-buy]', body);
      if (owned) return;
      b.addEventListener('click', () => {
        state.owned.push(d.id); save(); closeSheet(); renderMarket(); renderProfile();
        toast(`${d.name} added to your collection`);
      });
    });
  };
  const tickDealsTimer = () => {
    const now = new Date();
    const end = new Date(now); end.setHours(24, 0, 0, 0);
    let s = Math.max(0, Math.floor((end - now) / 1000));
    const h = String(Math.floor(s / 3600)).padStart(2, '0'); s %= 3600;
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    $('#deals-timer').textContent = `${h}:${m}:${String(s % 60).padStart(2, '0')}`;
  };
  const initMarket = () => {
    renderMarket();
    $('#deals').addEventListener('click', (e) => {
      const b = e.target.closest('[data-deal]');
      if (b) openDeal(DEALS.find((d) => d.id === b.dataset.deal));
    });
    tickDealsTimer();
    setInterval(tickDealsTimer, 1000);
  };

  // ---------- Results ----------
  let resultsTab = 'all';
  const renderResults = () => {
    const won = RESULTS.filter((r) => r[8] > 0);
    const net = RESULTS.reduce((a, r) => a + r[8], 0);
    $('#results-summary').innerHTML = `
      <div><b class="pos">${won.length}</b><span>Won</span></div>
      <div><b class="neg">${RESULTS.length - won.length}</b><span>Lost</span></div>
      <div><b class="${net >= 0 ? 'pos' : 'neg'}">${net >= 0 ? '+' : '−'}${fmt(Math.abs(net))}</b><span>Net coins</span></div>`;
    const list = RESULTS.filter((r) => resultsTab === 'all' || (resultsTab === 'won' ? r[8] > 0 : r[8] < 0));
    $('#results-list').innerHTML = list.map(([league, home, away, ago, hs, as, pick, players, coins]) => {
      const win = coins > 0;
      const pickName = pick === 'DRAW' ? 'Draw' : TEAMS[pick][0];
      return `
        <article class="match-card">
          <div class="outcome ${win ? 'won' : 'lost'}"><small>${win ? 'Won' : 'Lost'}</small><b>${win ? '+' : '−'}${fmt(Math.abs(coins))}</b><em>coins</em></div>
          <div class="mc-body">
            <div class="mc-top">${leagueTag(league)}<span class="when-chip">${pastLabel(ago)}</span></div>
            <div class="teams">${team(home)}<span class="score">${hs} : ${as}</span>${team(away)}</div>
            <div class="pick">Your pick: <b>${esc(pickName)}</b> · ${players} players</div>
          </div>
        </article>`;
    }).join('');
  };
  const initResults = () => {
    $('#results-tabs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-tab]');
      if (!b) return;
      resultsTab = b.dataset.tab;
      $$('#results-tabs button').forEach((x) => x.classList.toggle('is-active', x === b));
      renderResults();
    });
    renderResults();
  };

  // ---------- Profile ----------
  const CREW_COLORS = ['#e8394a', '#3d9bff', '#2ecf7a', '#9b7bff', '#ff7a3d', '#12a0d7'];
  const renderProfile = () => {
    const items = DEALS.filter((d) => state.owned.includes(d.id));
    $('#collection-count').textContent = items.length;
    $('#collection').innerHTML = items.map((d) => `<figure><img src="${d.img}" alt=""><figcaption>${esc(d.name)}</figcaption></figure>`).join('') +
      `<figure><button class="add" data-go="market" aria-label="Open Market">${icon('plus')}</button><figcaption>Get gear</figcaption></figure>`;
    $('#crew-count').textContent = CREW.length;
    $('#crew').innerHTML = CREW.map((c, i) => `<div class="mate"><span class="pic${i % 3 !== 2 ? ' online' : ''}" style="--c:${CREW_COLORS[i]}">${c[0]}</span>${c}</div>`).join('');
    paintIcons($('#collection'));
  };
  const initProfile = () => {
    renderProfile();
    $('#set-reminders').addEventListener('change', (e) => toast(e.target.checked ? 'Match reminders on' : 'Match reminders off'));
    $('#set-sound').addEventListener('change', (e) => toast(e.target.checked ? 'Sound effects on' : 'Sound effects off'));
  };

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

  paintIcons();
  renderBalance();
  renderBell();
  initGuide();
  initMatches();
  initMarket();
  initResults();
  initProfile();
  go(location.hash.slice(1) || 'home');
})();
