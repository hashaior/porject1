// Results screen. Markup and art are taken from results-screen.html.
// Added: the league sheet and the day buttons now filter the list.
(() => {
  'use strict';

  const I = (p, c = '#9FB3BD', s = 24, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const P = {
    chev: '<path d="m6 9 6 6 6-6"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', check: '<path d="M5 12.5 10 17 19 7"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  };
  const status = `<div class="status"><span>9:41</span><svg width="68" height="12" viewBox="0 0 68 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#fff"/><rect x="5" y="6" width="3" height="6" rx="1" fill="#fff"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#fff"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#fff"/><path d="M25 4.5a9 9 0 0 1 12 0M27.5 7a5.5 5.5 0 0 1 7 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="31" cy="10" r="1.4" fill="#fff"/><rect x="42.5" y=".5" width="22" height="11" rx="3" stroke="#fff" stroke-opacity=".5" fill="none"/><rect x="44.5" y="2.5" width="16" height="7" rx="1.6" fill="#fff"/></svg></div>`;
  const rays = `<div class="rays"><div class="glow"></div><i style="left:40px;width:60px;transform:rotate(18deg)"></i><i style="left:160px;width:40px;transform:rotate(12deg)"></i><i style="left:270px;width:70px;transform:rotate(8deg)"></i></div>`;
  const balance = () => `<div class="bal"><div class="coin"><svg width="16" height="16" viewBox="0 0 24 24"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" fill="#FFF4C9" stroke="#A86E17" stroke-width="1.6"/></svg></div><div><small>Balance</small><b data-bal-num>${window.APP ? APP.fmtBalance() : '1,250'}</b></div><div class="gold topup" data-action="topup">+ Top up</div></div>`;

  const T = {
    LIV: ['Liverpool', '#E0414B', '#9C1520'], MCI: ['Man City', '#8FD3FF', '#3A89C9'], ARS: ['Arsenal', '#F0504F', '#B01E23'], CHE: ['Chelsea', '#3E6FD8', '#16275E'],
    RMA: ['Real Madrid', '#FFFFFF', '#C9CED6'], BAR: ['Barcelona', '#C23B6A', '#27407E'], MTA: ['Maccabi TA', '#FFD84D', '#D9A514'], HBS: ["H. Be'er Sheva", '#E24A4A', '#8E1B1B'],
    INT: ['Inter', '#3E6FD8', '#16275E'], JUV: ['Juventus', '#5A5A5A', '#151515'], ATM: ['Atlético', '#E24A4A', '#27407E'], SEV: ['Sevilla', '#F2F2F2', '#C9303A'],
  };
  const crest = (k, cls = '') => { const [, a, b] = T[k]; const dark = ['RMA', 'MTA', 'SEV'].includes(k); return `<div class="crest ${cls}" style="background:linear-gradient(180deg,${a},${b});color:${dark ? '#1B2B5A' : '#fff'}">${k}</div>`; };
  const GROUPS = [
    { key: 'PL', lg: 'Premier League', c: 'England', dot: '#9B7BFF', date: 'Tue 29.09', m: [['LIV', 'MCI', 2, 1, '21:00', true], ['ARS', 'CHE', 0, 0, '18:30']] },
    { key: 'LL', lg: 'La Liga', c: 'Spain', dot: '#FF7A45', date: 'Mon 28.09', m: [['RMA', 'BAR', 3, 1, '22:00'], ['ATM', 'SEV', 1, 2, '19:30']] },
    { key: 'IL', lg: "Ligat Ha'Al", c: 'Israel', dot: '#3DD9A4', date: 'Sun 27.09', m: [['MTA', 'HBS', 1, 2, '20:30']] },
    { key: 'SA', lg: 'Serie A', c: 'Italy', dot: '#4DA3FF', date: 'Sun 27.09', m: [['INT', 'JUV', 1, 1, '21:45']] },
  ];
  const DAYS = [['ALL', 'WEEK', 1], ['TODAY', '30', 0], ['TUE', '29', 1], ['MON', '28', 1], ['SUN', '27', 1], ['SAT', '26', 1], ['FRI', '25', 0], ['THU', '24', 1]];
  const LEAGUES_LIST = [['ALL', 'All leagues', '', '#F2B84B'], ['PL', 'Premier League', 'England', '#9B7BFF'], ['LL', 'La Liga', 'Spain', '#FF7A45'], ['IL', "Ligat Ha'Al", 'Israel', '#3DD9A4'], ['SA', 'Serie A', 'Italy', '#4DA3FF'], ['CL', 'Champions League', 'Europe', '#1F5FD1']];
  const countFor = (k) => (GROUPS.find((g) => g.key === k) || { m: [] }).m.length;

  // Filter state. An empty set means all leagues.
  const state = { leagues: new Set(), day: 0, firstSheet: true };
  let draft = null;

  function details(h, a, hs, as) {
    const main = h === 'LIV';
    return `<div class="more">
   <div class="score-banner"><div class="sb-team">${crest(h)}${T[h][0]}</div>
    <div class="sb-mid"><div class="big"><em>${hs}</em> : ${as}</div><span class="ftl">FULL TIME</span>${main ? '<div class="ht">Half time 1 – 0</div>' : ''}</div>
    <div class="sb-team">${crest(a)}${T[a][0]}</div></div>
   ${main ? `<div class="sub">GOALS</div>
   <div class="goals">
     <div class="goal"><span class="min">23'</span><span class="ball">⚽</span>M. Salah</div>
     <div class="goal away"><span class="min">58'</span><span class="ball">⚽</span>E. Haaland</div>
     <div class="goal"><span class="min">81'</span><span class="ball">⚽</span>D. Szoboszlai <span style="color:var(--dim);font-weight:600">(pen.)</span></div>
   </div>` : ''}
   <div class="sub">MATCH STATS</div>
   ${[['Possession', '54%', '46%', 54], ['Shots', '14', '9', 61], ['On target', '6', '3', 67], ['Corners', '7', '4', 64], ['Yellow cards', '2', '3', 40]].map(([l, x, y, p]) => `<div class="lab" style="font-size:10.5px;color:var(--dim);font-weight:800;text-align:center;letter-spacing:.05em;text-transform:uppercase;margin-bottom:4px">${l}</div><div class="stat"><b>${x}</b><div class="bars"><i class="h" style="width:${p}%"></i><i class="a" style="width:${100 - p}%"></i></div><b>${y}</b></div>`).join('')}
   ${main ? `<div class="party"><div class="tro">${I(P.trophy, '#FCE39A', 22, 2.4)}</div><div><div class="t1">YOUR PARTY WON! +120</div><div class="t2">Lobby “Friday Crew” · 6 players</div></div><div class="go" onclick="APP.toast('Friday Crew lobby: 6 players, you won +120')">VIEW ›</div></div>` : `<div class="party lost"><div class="tro" style="background:rgba(242,184,75,.15)">${I(P.trophy, '#7F95A0', 22, 2.4)}</div><div><div class="t1" style="color:#fff">NO PARTY FOR THIS MATCH</div><div class="t2" style="color:#7F95A0">Create a lobby for the next one!</div></div></div>`}
  </div>`;
  }

  function visibleGroups() {
    const dayNum = state.day ? DAYS[state.day][1] : null;
    return GROUPS.filter((g) => (!state.leagues.size || state.leagues.has(g.key)) && (!dayNum || g.date.includes(` ${dayNum}.`)));
  }

  function results(openFirst = true) {
    const groups = visibleGroups();
    const badge = state.leagues.size ? String(state.leagues.size) : 'ALL';
    return `${rays}<div class="scroll">${status}
   <div class="topbar">${balance()}</div>
   <div class="title"><div><h1>RESULTS</h1><p>Final scores from the last 7 days</p></div>
     <div class="league-btn gold" onclick="RS.openLeagues(this)">${I(P.filter, '#2B1A04', 18, 2.8)}LEAGUE<span class="n">${badge}</span></div></div>
   <div class="dates">${DAYS.map(([a, b, has], i) => `<div class="day ${i === 0 ? 'all' : ''} ${i === state.day ? 'on' : ''}" onclick="RS.pickDay(${i})"><small>${a}</small><b>${b}</b>${has ? '<span class="d"></span>' : ''}</div>`).join('')}</div>
   <div class="note">${I(P.info, '#7F95A0', 14, 2.2)} Results are kept for 7 days · tap a match for details</div>
   ${groups.length ? groups.map((g, gi) => `<div class="group"><div class="ghead"><span class="dot" style="background:${g.dot}"></span><b>${g.lg}</b><span>${g.c}</span><span class="date">${g.date}</span></div>
     <div class="list">${g.m.map(([h, a, hs, as, t], mi) => { const open = openFirst && gi === 0 && mi === 0; return `<div class="card ${open ? 'open' : ''}">
       <div class="row" onclick="this.parentElement.classList.toggle('open')">
        <div class="st"><span class="ft">FT</span><small>${t}</small></div>
        <div class="teams"><div class="tm ${hs > as ? 'win' : ''}">${crest(h)}<span class="nm">${T[h][0]}</span></div><div class="tm ${as > hs ? 'win' : ''}">${crest(a)}<span class="nm">${T[a][0]}</span></div></div>
        <div class="scores"><b class="${hs > as ? 'w' : ''}">${hs}</b><b class="${as > hs ? 'w' : ''}">${as}</b></div>
        <div class="chev">${I(P.chev, '#F6D58A', 16, 2.8)}</div>
       </div>${details(h, a, hs, as)}</div>`; }).join('')}</div></div>`).join('')
    : '<div class="empty-day"><b>NO RESULTS</b>No finished matches for this day or league.</div>'}
  </div>`;
  }

  function leagueSheet() {
    const sel = draft;
    const total = sel.size ? [...sel].reduce((n, k) => n + countFor(k), 0) : GROUPS.reduce((n, g) => n + g.m.length, 0);
    return `<div class="dim" onclick="RS.closeSheet()"></div><div class="sheet"><div class="plate">CHOOSE LEAGUE</div>
   <div class="close" onclick="RS.closeSheet()">${I(P.x, '#fff', 16, 3.2)}</div>
   <div class="search">${I(P.search, '#A9BCC4', 18, 2.4)}<input id="league-search" placeholder="Search league or country" oninput="RS.searchLeagues(this.value)"></div>
   <div class="lg">${LEAGUES_LIST.map(([k, n, c, col]) => { const on = k === 'ALL' ? !sel.size : sel.has(k); const cnt = countFor(k); return `<div class="lgi ${on ? 'on' : ''}" data-q="${(n + ' ' + c).toLowerCase()}" onclick="RS.toggleLeague('${k}')"><div class="ico" style="background:${col}">${k}</div><div><div class="n">${n}</div>${c ? `<div class="c">${c}</div>` : ''}</div><span class="cnt">${k === 'ALL' ? '' : cnt + (cnt === 1 ? ' result' : ' results')}</span><div class="box">${I(P.check, '#fff', 14, 3.4)}</div></div>`; }).join('')}</div>
   <div class="btns"><div class="btn sec" onclick="RS.resetLeagues()">RESET</div><div class="btn pri" onclick="RS.applyLeagues()">SHOW ${total} ${total === 1 ? 'RESULT' : 'RESULTS'}</div></div></div>`;
  }

  const screen = () => document.getElementById('screen-results');
  const render = (openFirst = true) => { screen().innerHTML = results(openFirst); };
  const renderSheet = () => {
    screen().querySelectorAll('.dim,.sheet').forEach((n) => n.remove());
    screen().insertAdjacentHTML('beforeend', leagueSheet());
  };

  window.RS = {
    openLeagues() {
      // First open shows the example selection from the design.
      draft = state.firstSheet ? new Set(['PL', 'IL']) : new Set(state.leagues);
      state.firstSheet = false;
      renderSheet();
    },
    closeSheet() { draft = null; screen().querySelectorAll('.dim,.sheet').forEach((n) => n.remove()); },
    toggleLeague(k) {
      if (k === 'ALL') draft.clear();
      else draft.has(k) ? draft.delete(k) : draft.add(k);
      renderSheet();
    },
    resetLeagues() { draft.clear(); renderSheet(); },
    applyLeagues() { state.leagues = draft; draft = null; render(true); },
    searchLeagues(q) {
      q = q.trim().toLowerCase();
      screen().querySelectorAll('.lgi').forEach((el) => { el.style.display = !q || el.dataset.q.includes(q) ? '' : 'none'; });
    },
    pickDay(i) {
      state.day = i;
      const sc = screen().querySelector('.scroll');
      const top = sc ? sc.scrollTop : 0;
      render(true);
      screen().querySelector('.scroll').scrollTop = top;
    },
  };

  render(true);
})();
