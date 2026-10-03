// Lucky Wheel: one free spin per day from the Home screen. Some slices win nothing.
(() => {
  'use strict';

  // Clockwise from the top. weight = relative chance.
  const SLICES = [
    { coins: 50, color: ['#8AD6CB', '#3F8C85'], weight: 22 },
    { coins: 0, label: 'NO LUCK', color: ['#2C3E47', '#16232A'], weight: 16 },
    { coins: 100, color: ['#C9A2FF', '#6A3FB5'], weight: 14 },
    { coins: 0, label: 'SO CLOSE', color: ['#2C3E47', '#16232A'], weight: 16 },
    { coins: 25, color: ['#8AD6CB', '#3F8C85'], weight: 22 },
    { coins: 250, color: ['#FF7A7F', '#C9303A'], weight: 6 },
    { coins: 0, label: 'NO LUCK', color: ['#2C3E47', '#16232A'], weight: 16 },
    { coins: 500, label: 'JACKPOT', color: ['#FCE39A', '#DB952F'], weight: 2 },
  ];
  const N = SLICES.length; const SEG = 360 / N;
  const KEY = 'sharko.wheel.v1';
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const saveSpin = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignore */ } };
  let memory = load(); // also kept in memory in case storage is blocked
  const canSpin = () => memory.last !== today();
  const untilMidnight = () => {
    const now = new Date(); const end = new Date(now); end.setHours(24, 0, 0, 0);
    let s = Math.floor((end - now) / 1000);
    const h = String(Math.floor(s / 3600)).padStart(2, '0'); s %= 3600;
    return `${h}:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  const coinIc = (s, x = 0, y = 0) => `<g transform="translate(${x - s / 2} ${y - s / 2})"><svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F2B84B" stroke="#1B1230" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#B8741F" stroke-width="1.6"/><path d="m12 8 1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="#FFF4C9"/></svg></g>`;
  const pt = (r, a) => `${(r * Math.sin(a * Math.PI / 180)).toFixed(2)} ${(-r * Math.cos(a * Math.PI / 180)).toFixed(2)}`;

  function wheelSVG(mini) {
    const R = 140;
    let defs = ''; let segs = ''; let labels = '';
    SLICES.forEach((s, i) => {
      const a0 = i * SEG - SEG / 2; const a1 = a0 + SEG;
      defs += `<radialGradient id="ws${mini ? 'm' : ''}${i}" cx="0" cy="0" r="${R}" gradientUnits="userSpaceOnUse"><stop offset=".25" stop-color="${s.color[1]}"/><stop offset="1" stop-color="${s.color[0]}"/></radialGradient>`;
      segs += `<path d="M0 0 L${pt(R, a0)} A${R} ${R} 0 0 1 ${pt(R, a1)} Z" fill="url(#ws${mini ? 'm' : ''}${i})" stroke="#1B1230" stroke-width="3" stroke-linejoin="round"/>`;
      if (mini) return;
      const dark = s.color[0] === '#FCE39A';
      const fill = dark ? '#2B1A04' : '#fff';
      const shadow = dark ? 'none' : '#1B1230';
      const txt = (t, y, size) => `<text x="0" y="${y}" text-anchor="middle" font-family="Lilita One, sans-serif" font-size="${size}" fill="${fill}" stroke="${shadow}" stroke-width="${dark ? 0 : 3}" paint-order="stroke" letter-spacing="1">${t}</text>`;
      labels += `<g transform="rotate(${i * SEG})">${s.coins
        ? `${coinIc(22, 0, -112)}${txt(s.coins, -80, 24)}${s.label ? txt(s.label, -60, 11) : ''}`
        : `<g transform="translate(0 -110)"><circle r="11" fill="#E5484D" stroke="#1B1230" stroke-width="2.5"/><path d="M-4.5 -4.5 4.5 4.5M4.5 -4.5 -4.5 4.5" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>${txt(s.label.split(' ')[0], -80, 14)}${txt(s.label.split(' ')[1], -64, 14)}`}</g>`;
    });
    const lights = mini ? '' : Array.from({ length: 16 }, (_, i) => `<circle cx="${pt(151, i * 22.5).split(' ')[0]}" cy="${pt(151, i * 22.5).split(' ')[1]}" r="5" class="wl ${i % 2 ? 'b' : ''}"/>`).join('');
    return `<svg viewBox="-165 -165 330 330" width="100%" height="100%" aria-hidden="true"><defs>${defs}<linearGradient id="wrim${mini ? 'm' : ''}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE59A"/><stop offset="1" stop-color="#B8741F"/></linearGradient></defs>
      <circle r="160" fill="url(#wrim${mini ? 'm' : ''})" stroke="#1B1230" stroke-width="4"/><circle r="${R + 2}" fill="#1B1230"/>
      ${lights}<g class="wheel-rot">${segs}${labels}</g></svg>`;
  }

  /* ---------- Home button ---------- */
  function addButton() {
    const home = document.getElementById('screen-home');
    if (!home || document.getElementById('wheel-btn')) return;
    home.insertAdjacentHTML('beforeend', `<button class="wheel-btn" id="wheel-btn" aria-label="Lucky wheel, one free spin a day">
      <span class="wb-wheel">${wheelSVG(true)}<span class="wb-hub"></span></span><span class="wb-label">SPIN</span><span class="wb-dot" id="wheel-dot">1</span></button>`);
    document.getElementById('wheel-btn').onclick = open;
    refreshButton();
  }
  const refreshButton = () => {
    const btn = document.getElementById('wheel-btn'); if (!btn) return;
    btn.classList.toggle('ready', canSpin());
    document.getElementById('wheel-dot').hidden = !canSpin();
  };

  /* ---------- Wheel window ---------- */
  let rotation = 0; let spinning = false; let timer;
  function open() {
    close();
    const ready = canSpin();
    document.getElementById('phone').insertAdjacentHTML('beforeend', `<div class="wheel-modal" id="wheel-modal" role="dialog" aria-label="Lucky wheel">
      <div class="wm-dim"></div>
      <div class="wm-box">
        <div class="wm-close" id="wm-close" aria-label="Close">${'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'}</div>
        <div class="wm-plate">LUCKY WHEEL</div>
        <p class="wm-sub">One free spin every day. Win up to <b>500 coins!</b></p>
        <div class="wm-wheel" id="wm-wheel">
          <div class="wm-pointer"></div>
          <div class="wm-spinner" id="wm-spinner" style="transform:rotate(${rotation}deg)">${wheelSVG(false)}</div>
          <button class="wm-hub" id="wm-hub" ${ready ? '' : 'disabled'}>SPIN</button>
        </div>
        <div class="wm-foot" id="wm-foot">${footer()}</div>
        <button class="wm-reset" id="wm-reset">Reset daily spin (demo)</button>
      </div>
      <div class="wm-result" id="wm-result" hidden></div>
    </div>`);
    const m = document.getElementById('wheel-modal');
    m.querySelector('.wm-dim').onclick = () => !spinning && close();
    document.getElementById('wm-close').onclick = () => !spinning && close();
    document.getElementById('wm-hub').onclick = spin;
    document.getElementById('wm-reset').onclick = () => { memory = {}; saveSpin(memory); refreshButton(); open(); };
    wireFoot();
    clearInterval(timer);
    timer = setInterval(() => { const t = document.getElementById('wm-countdown'); if (t) t.textContent = untilMidnight(); }, 1000);
  }
  const footer = () => (canSpin()
    ? '<button class="wm-spin" id="wm-spin">SPIN NOW!</button>'
    : `<div class="wm-wait"><small>NEXT FREE SPIN IN</small><b id="wm-countdown">${untilMidnight()}</b></div>`);
  const wireFoot = () => { const b = document.getElementById('wm-spin'); if (b) b.onclick = spin; };
  function close() { clearInterval(timer); const m = document.getElementById('wheel-modal'); if (m) m.remove(); }

  function pick() {
    const total = SLICES.reduce((n, s) => n + s.weight, 0);
    let r = Math.random() * total;
    for (let i = 0; i < N; i++) { r -= SLICES[i].weight; if (r < 0) return i; }
    return 0;
  }
  function spin() {
    if (spinning || !canSpin()) return;
    spinning = true;
    const i = pick();
    const jitter = (Math.random() - 0.5) * (SEG * 0.6);
    const current = ((rotation % 360) + 360) % 360;
    const target = (360 - i * SEG + jitter) % 360;
    rotation += 360 * 6 + ((target - current + 360) % 360);
    const sp = document.getElementById('wm-spinner');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    sp.style.transition = `transform ${reduce ? 0.4 : 4.8}s cubic-bezier(.12,.72,.12,1)`;
    sp.style.transform = `rotate(${rotation}deg)`;
    document.getElementById('wm-hub').disabled = true;
    const sb = document.getElementById('wm-spin'); if (sb) sb.disabled = true;
    document.getElementById('wm-wheel').classList.add('spinning');
    setTimeout(() => finish(i), reduce ? 450 : 4900);
  }
  function finish(i) {
    spinning = false;
    memory = { last: today() }; saveSpin(memory);
    if (window.STATS) { STATS.add('spins'); STATS.max('wheelBest', SLICES[i].coins); }
    refreshButton();
    document.getElementById('wm-wheel').classList.remove('spinning');
    document.getElementById('wm-foot').innerHTML = footer();
    const s = SLICES[i];
    const res = document.getElementById('wm-result');
    if (s.coins) {
      APP.addCoins(s.coins);
      res.innerHTML = `<div class="wr-card win"><div class="wr-burst"></div><div class="wr-plate">${s.coins >= 500 ? 'JACKPOT!' : 'YOU WON!'}</div>
        <div class="wr-coins"><svg width="44" height="44" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F2B84B" stroke="#1B1230" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#B8741F" stroke-width="1.6"/><path d="m12 8 1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="#FFF4C9"/></svg><b>+${s.coins}</b></div>
        <p>The coins are in your balance.</p><button class="wr-btn" id="wr-ok">COLLECT</button></div>`;
    } else {
      res.innerHTML = `<div class="wr-card lose"><div class="wr-plate">NO LUCK TODAY</div><div class="wr-x">✕</div>
        <p>The wheel landed on <b>${s.label}</b>. Come back tomorrow for another free spin!</p><button class="wr-btn" id="wr-ok">OK</button></div>`;
    }
    res.hidden = false;
    document.getElementById('wr-ok').onclick = () => { res.hidden = true; };
  }

  window.WHEEL = { open };
  addButton();
  setInterval(refreshButton, 30000);
})();
