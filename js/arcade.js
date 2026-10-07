// Arcade navigation bar: illustrated icons, raised active tab with a label, red badges and a
// "FREE SPIN!" bubble. Part of the arcade look (css/arcade.css). Loaded before app.js.
(() => {
  'use strict';

  const INK = '#14204F';
  const O = `stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
  const ICONS = {
    home: `<svg viewBox="0 0 48 48"><rect x="31" y="8" width="6" height="11" rx="1" fill="#C9483F" ${O}/>
      <path d="M11 24v15a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V24L24 12z" fill="#FFF1D6" ${O}/>
      <path d="M4 25 24 7l20 18-4 4L24 15 8 29z" fill="#FF5A5F" ${O}/><path d="M12 22 24 11" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="20" y="29" width="9" height="13" rx="2" fill="#3E7BFA" ${O}/><circle cx="26.5" cy="36" r="1.2" fill="${INK}"/>
      <rect x="13.5" y="27" width="5" height="5" rx="1" fill="#8FE3FF" stroke="${INK}" stroke-width="2"/></svg>`,
    market: `<svg viewBox="0 0 48 48"><rect x="9" y="22" width="30" height="20" rx="3" fill="#FFF1D6" ${O}/>
      <rect x="9" y="33" width="30" height="9" rx="2" fill="#B5763F" ${O}/>
      <rect x="8" y="7" width="32" height="7" rx="3" fill="#FFD23F" ${O}/>
      <path d="M6 14h36l-2 9a4 4 0 0 1-8 0 4 4 0 0 1-8 0 4 4 0 0 1-8 0 4 4 0 0 1-8 0z" fill="#FF5A5F" ${O}/>
      <path d="M15.2 15l-.8 8M24 15v8.5M32.8 15l.8 8" stroke="#fff" stroke-width="4"/>
      <path d="M6 14h36l-2 9a4 4 0 0 1-8 0 4 4 0 0 1-8 0 4 4 0 0 1-8 0 4 4 0 0 1-8 0z" fill="none" ${O}/>
      <circle cx="24" cy="31" r="5" fill="#FFD23F" ${O}/><path d="M24 28.5v5" stroke="${INK}" stroke-width="2"/></svg>`,
    matches: `<svg viewBox="0 0 48 48"><path d="M9 6l21 21-3.5 3.5L6 10V6z" fill="#E6F0FF" ${O}/><path d="M39 6L18 27l3.5 3.5L42 10V6z" fill="#E6F0FF" ${O}/>
      <path d="M12 9l15 15M36 9 21 24" stroke="#9FB8E6" stroke-width="2" stroke-linecap="round"/>
      <path d="M13 26l9 9M35 26l-9 9" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M13 26l9 9M35 26l-9 9" stroke="#FFD23F" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M16 35l-6 6M32 35l6 6" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M16 35l-6 6M32 35l6 6" stroke="#B5763F" stroke-width="3.4" stroke-linecap="round"/>
      <circle cx="24" cy="38" r="7.5" fill="#fff" ${O}/><path d="M24 34.2l3.3 2.4-1.3 3.9h-4l-1.3-3.9z" fill="${INK}"/></svg>`,
    results: `<svg viewBox="0 0 48 48"><path d="M15 37v7M33 37v7" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>
      <rect x="4" y="9" width="40" height="29" rx="6" fill="#3B3FA8" ${O}/><rect x="4" y="9" width="40" height="8" rx="4" fill="#FF5A5F" ${O}/>
      <circle cx="12" cy="13" r="1.6" fill="#FFF1D6"/><circle cx="24" cy="13" r="1.6" fill="#FFF1D6"/><circle cx="36" cy="13" r="1.6" fill="#FFF1D6"/>
      <rect x="9" y="20" width="12" height="13" rx="2.5" fill="#0E1440" stroke="${INK}" stroke-width="2"/><rect x="27" y="20" width="12" height="13" rx="2.5" fill="#0E1440" stroke="${INK}" stroke-width="2"/>
      <text x="15" y="31" text-anchor="middle" font-family="Lilita One, sans-serif" font-size="11" fill="#FFE27A">2</text><text x="33" y="31" text-anchor="middle" font-family="Lilita One, sans-serif" font-size="11" fill="#FFE27A">1</text>
      <circle cx="24" cy="24.5" r="1.4" fill="#FFE27A"/><circle cx="24" cy="29" r="1.4" fill="#FFE27A"/></svg>`,
    profile: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="#4FA6FF" ${O}/><circle cx="24" cy="20" r="7" fill="#FFF1D6" ${O}/><path d="M11 37c2-6 7-9 13-9s11 3 13 9" fill="#FFF1D6" ${O}/></svg>`,
  };
  const TABS = [['home', 'HOME'], ['market', 'SHOP'], ['matches', 'PLAY'], ['results', 'RESULTS'], ['profile', 'PROFILE']];

  function build() {
    const nav = document.getElementById('tabbar');
    if (!nav) return;
    const active = (nav.querySelector('.is-active') || {}).dataset;
    nav.classList.add('ar-nav');
    nav.innerHTML = TABS.map(([k, label]) => `<button data-go="${k}" aria-label="${label}" class="${active && active.go === k ? 'is-active' : ''}">
      <span class="ar-ic ${k === 'profile' ? 'avatar' : ''}" id="ar-ic-${k}">${ICONS[k]}</span><span class="ar-lbl">${label}</span>
      <span class="ar-badge" id="ar-badge-${k}" hidden></span></button>`).join('');
    nav.insertAdjacentHTML('afterend', '<div class="ar-tip" id="ar-tip" hidden>🎡 FREE SPIN!</div>');
    document.getElementById('ar-tip').onclick = () => { APP.go('home'); if (window.WHEEL) setTimeout(() => WHEEL.open(), 150); };
  }

  // Badges: lobby / live match, claimable achievements, new shop deals, free spin.
  const SHOP_KEY = 'sharko.shopSeen';
  const today = () => new Date().toDateString();
  let avatarKey = '';
  function refresh() {
    const set = (k, text, cls = '') => {
      const b = document.getElementById(`ar-badge-${k}`); if (!b) return;
      b.hidden = !text; if (text && b.textContent !== String(text)) { b.textContent = text; b.className = `ar-badge ${cls}`; }
    };
    const current = (document.querySelector('#tabbar .is-active') || { dataset: {} }).dataset.go;
    // PLAY: live match or open lobby
    const L = window.LOBBY && LOBBY.isActive() && LOBBY.state();
    set('matches', L ? (L.phase === 'live' ? 'LIVE' : L.phase === 'final' ? '🏆' : '1') : '', L && L.phase === 'live' ? 'live' : '');
    // SHOP: new daily deals until you open the Market today
    let seen = ''; try { seen = localStorage.getItem(SHOP_KEY) || ''; } catch (e) { /* ignore */ }
    if (current === 'market' && seen !== today()) { try { localStorage.setItem(SHOP_KEY, today()); } catch (e) { /* ignore */ } seen = today(); }
    set('market', seen === today() ? '' : 'NEW');
    // PROFILE: achievements ready to claim + your avatar as the icon
    if (window.STATS && window.PS && PS.marketItems) {
      const owned = PS.marketItems().filter((k) => PS.owns(k)).length;
      const n = STATS.achievements({ owned }).filter((a) => a.done && !a.claimed).length;
      set('profile', n ? String(n) : '');
      const look = PS.look(); const key = look.animal;
      if (key !== avatarKey) { avatarKey = key; const ic = document.getElementById('ar-ic-profile'); if (ic) ic.innerHTML = PS.animal(key); }
    }
    // FREE SPIN bubble over Home when the Lucky Wheel is ready and you're elsewhere
    const tip = document.getElementById('ar-tip');
    const ready = document.getElementById('wheel-btn') && document.getElementById('wheel-btn').classList.contains('ready');
    if (tip) tip.hidden = !(ready && current !== 'home' && !document.querySelector('.auth'));
  }

  build();
  setInterval(refresh, 800);
  setTimeout(refresh, 50);
})();
