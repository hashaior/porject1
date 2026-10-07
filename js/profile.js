// Profile screen. Markup and art are taken from profile-screen_1.html.
// Added: Wardrobe opens from the Profile, items can be equipped, and the avatar choice is saved.
(() => {
  'use strict';

  /* ============ ART ============ */
  const O = 'stroke="#1B1230" stroke-width="3" stroke-linejoin="round"';
  const g = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${O}/><circle cx="${x + 1}" cy="${y + 1}" r="${r * 0.5}" fill="#1B1230"/><circle cx="${x - r * 0.1}" cy="${y - r * 0.18}" r="${r * 0.2}" fill="#fff"/>`;
  const cheeks = (y, x1 = 28, x2 = 72) => `<ellipse cx="${x1}" cy="${y}" rx="5" ry="3" fill="#FF6FA0" fill-opacity=".55"/><ellipse cx="${x2}" cy="${y}" rx="5" ry="3" fill="#FF6FA0" fill-opacity=".55"/>`;
  let uid = 0;
  function svgWrap(defs, body, vb = '0 0 100 100') {
    // unique gradient ids per instance
    const k = 'u' + (uid++);
    const d = defs.replace(/id="(\w+)"/g, `id="$1${k}"`);
    const b = body.replace(/url\(#(\w+)\)/g, `url(#$1${k})`);
    return `<svg viewBox="${vb}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs>${d}</defs>${b}</svg>`;
  }
  let spikes = ''; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; const p = (r, da) => `${(50 + r * Math.cos(a + da)).toFixed(1)} ${(54 + r * Math.sin(a + da)).toFixed(1)}`; spikes += `<path d="M${p(34, -0.12)}L${p(46, 0)}L${p(34, 0.12)}Z" fill="#F2B83B" ${O}/>`; }
  const ANIMALS = {
    shark: { name: 'Finn', kind: 'Shark', bg: ['#56C2CF', '#1E5E73'], desc: 'Bold, fast and always hungry for a win.', traits: ['Fearless', 'Leader'],
      defs: g('s', '#A3C4DA', '#5A7F9C'),
      body: `<path d="M40 30L54 6l10 26z" fill="#5E7F99" ${O}/><path d="M12 58c0-26 18-38 38-38s38 12 38 38c0 22-18 34-38 34S12 80 12 58z" fill="url(#s)" ${O}/><path d="M22 62q28 10 56 0-4 20-28 22-24-2-28-22z" fill="#7A1F3D" ${O}/><path d="M24 63l4 6 4-5 4 6 4-5 4 6 4-5 4 6 4-5 4 6 4-5 4 6 4-5 4 5" fill="#fff" stroke="#1B1230" stroke-width="2" stroke-linejoin="round"/><path d="M16 54q4 4 0 8M84 54q-4 4 0 8" stroke="#3D5A70" stroke-width="2.5" fill="none" stroke-linecap="round"/>${eye(36, 46, 9)}${eye(64, 46, 9)}<path d="M26 34l17 5M74 34l-17 5" stroke="#1B1230" stroke-width="4" stroke-linecap="round"/><path d="M26 28q10-7 22-7" stroke="#fff" stroke-opacity=".5" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    octopus: { name: 'Inky', kind: 'Octopus', bg: ['#C9A2FF', '#5B2E9E'], desc: 'Eight arms, eight bets at once. A true strategist.', traits: ['Clever', 'Tricky'],
      defs: g('o', '#FFA3C7', '#E0457F'),
      body: `<path d="M24 66C14 76 16 90 8 92c10 4 20-6 22-18z" fill="url(#o)" ${O}/><path d="M38 72c-4 12 0 22-8 26 12 0 16-10 16-22z" fill="url(#o)" ${O}/><path d="M62 72c4 12 0 22 8 26-12 0-16-10-16-22z" fill="url(#o)" ${O}/><path d="M76 66c10 10 8 24 16 26-10 4-20-6-22-18z" fill="url(#o)" ${O}/><path d="M16 50c0-24 16-40 34-40s34 16 34 40c0 20-14 30-34 30S16 70 16 50z" fill="url(#o)" ${O}/><circle cx="36" cy="22" r="3" fill="#FFD1E3"/><circle cx="62" cy="20" r="4" fill="#FFD1E3"/><circle cx="72" cy="30" r="2.5" fill="#FFD1E3"/>${eye(38, 46, 10)}${eye(62, 46, 10)}${cheeks(60)}<path d="M42 62q8 8 16 0" stroke="#1B1230" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M26 30q6-12 18-15" stroke="#fff" stroke-opacity=".5" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    turtle: { name: 'Shelly', kind: 'Turtle', bg: ['#7FD8FF', '#2A6FC9'], desc: 'Slow and steady wins the league. Never panics.', traits: ['Calm', 'Lucky'],
      defs: g('h', '#B5D96A', '#5E8C31') + g('t', '#A6EB9A', '#3FA35E'),
      body: `<ellipse cx="50" cy="40" rx="40" ry="30" fill="url(#h)" ${O}/><path d="M50 16l12 10-4 14H42l-4-14z" fill="#D6EC8A" stroke="#3E5E1F" stroke-width="2.5" stroke-linejoin="round"/><path d="M38 26L18 30M62 26l20 4M42 40L28 58M58 40l14 18" stroke="#3E5E1F" stroke-width="2.5"/><circle cx="50" cy="66" r="28" fill="url(#t)" ${O}/>${eye(39, 60, 8)}${eye(61, 60, 8)}${cheeks(72, 32, 68)}<path d="M42 76q8 7 16 0" stroke="#1B1230" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="47" cy="69" r="1.2" fill="#1B1230"/><circle cx="53" cy="69" r="1.2" fill="#1B1230"/>` },
    crab: { name: 'Snips', kind: 'Crab', bg: ['#FFE4AE', '#E39A4F'], desc: 'Grabs every chance with both claws. Loud fan!', traits: ['Hype', 'Tough'],
      defs: g('c', '#FF8A7A', '#C9303A'),
      body: `<path d="M18 42l12 18M82 42L70 60" stroke="#1B1230" stroke-width="9" stroke-linecap="round"/><path d="M18 42l12 18M82 42L70 60" stroke="#E5484D" stroke-width="4" stroke-linecap="round"/><path d="M8 42C0 28 10 14 24 20l-6 10 9-1c2 10-6 18-19 13z" fill="url(#c)" ${O}/><path d="M92 42c8-14-2-28-16-22l6 10-9-1c-2 10 6 18 19 13z" fill="url(#c)" ${O}/><path d="M22 76l-10 8M26 82l-8 10M78 76l10 8M74 82l8 10" stroke="#1B1230" stroke-width="4" stroke-linecap="round"/><path d="M40 50l-2-20M60 50l2-20" stroke="#1B1230" stroke-width="7" stroke-linecap="round"/><path d="M40 50l-2-20M60 50l2-20" stroke="#E5484D" stroke-width="3" stroke-linecap="round"/><ellipse cx="50" cy="66" rx="34" ry="24" fill="url(#c)" ${O}/>${eye(38, 26, 9)}${eye(62, 26, 9)}${cheeks(70, 30, 70)}<path d="M40 70q10 9 20 0" stroke="#1B1230" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 54q8-6 16-6" stroke="#fff" stroke-opacity=".5" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    puffer: { name: 'Puffy', kind: 'Pufferfish', bg: ['#FFA8CC', '#B83468'], desc: 'Small but explosive. Puffs up on every goal.', traits: ['Funny', 'Wild'],
      defs: g('p', '#FFEE9A', '#F2B83B'),
      body: `<path d="M42 22q8-16 18 0z" fill="#FF9F43" ${O}/>${spikes}<path d="M14 54L2 44l2 20z" fill="#FF9F43" ${O}/><path d="M86 54l12-10-2 20z" fill="#FF9F43" ${O}/><circle cx="50" cy="54" r="34" fill="url(#p)" ${O}/><path d="M24 66q26 22 52 0-26 10-52 0z" fill="#FFF7DA"/><circle cx="30" cy="34" r="2" fill="#C98522"/><circle cx="68" cy="30" r="2.5" fill="#C98522"/><circle cx="74" cy="42" r="1.8" fill="#C98522"/>${eye(38, 48, 10)}${eye(62, 48, 10)}${cheeks(62, 26, 74)}<ellipse cx="50" cy="68" rx="6" ry="5" fill="#E5484D" ${O}/>` },
  };
  function animal(key, size = '100%') {
    const a = ANIMALS[key];
    return `<div style="width:${size};height:${size};border-radius:50%;overflow:hidden;position:relative;background:linear-gradient(180deg,${a.bg[0]},${a.bg[1]});box-shadow:inset 0 -6px 0 rgba(0,0,0,.25),inset 0 4px 0 rgba(255,255,255,.35)">
   <div style="position:absolute;left:-2%;right:-2%;top:12%;bottom:-14%">${svgWrap(a.defs, a.body)}</div></div>`;
  }
  /* items (from the Market) */
  const IO = 'stroke="#1B1230" stroke-width="2.5" stroke-linejoin="round"';
  const ITEMS = {
    pirate: { n: 'Pirate Hat', slot: 'hat', r: '#B98CFF', defs: g('a', '#4A4380', '#2A2550') + g('b', '#5A5296', '#2E2858'), body: `<path d="M20 46C20 26 30 16 42 16s22 10 22 30z" fill="url(#a)" ${IO}/><path d="M58 22c10-14 22-12 22-7-6 2-12 8-18 12z" fill="#E5484D" ${IO}/><path d="M4 50Q42 28 80 50q-8 16-38 12Q12 66 4 50z" fill="url(#b)" ${IO}/><path d="M10 49Q42 33 74 49" stroke="#F2C14E" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="42" cy="34" r="7" fill="#F2C14E" ${IO}/><path d="M39 33h6M42 30v7" stroke="#1B1230" stroke-width="2" stroke-linecap="round"/>` },
    goggles: { n: 'Diving Goggles', slot: 'eyes', r: '#4DA3FF', defs: g('a', '#FFE08A', '#D9962B') + g('b', '#C9FBFF', '#1E8FC9'), body: `<rect x="2" y="34" width="80" height="14" rx="7" fill="#6A3FB5" ${IO}/><rect x="10" y="20" width="64" height="42" rx="18" fill="url(#a)" ${IO}/><rect x="16" y="26" width="52" height="30" rx="13" fill="url(#b)" ${IO}/><path d="M22 34c3-4 8-6 14-6" stroke="#fff" stroke-opacity=".85" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    beanie: { n: 'Red Beanie', slot: 'hat', r: '#9FB3BD', defs: g('a', '#FF6A6F', '#B0212B'), body: `<path d="M14 56C14 32 26 20 42 20s28 12 28 36z" fill="url(#a)" ${IO}/><path d="M28 26v28M42 21v33M56 26v28" stroke="#8E1A22" stroke-opacity=".5" stroke-width="2.5"/><rect x="9" y="50" width="66" height="18" rx="8" fill="#C9303A" ${IO}/><path d="M17 54v10M25 54v10M33 54v10M41 54v10M49 54v10M57 54v10M65 54v10" stroke="#7E141C" stroke-opacity=".6" stroke-width="2.5" stroke-linecap="round"/><circle cx="42" cy="16" r="10" fill="#FFF4F0" ${IO}/>` },
    monocle: { n: 'Golden Monocle', slot: 'eyes', r: '#F2B84B', defs: g('a', '#FFE59A', '#C98522') + g('b', '#E8FBFF', '#7CC4E0'), body: `<path d="M50 50c6 8 10 14 22 24" stroke="#D9962B" stroke-width="3" stroke-dasharray="1 5" stroke-linecap="round" fill="none"/><circle cx="34" cy="34" r="22" fill="url(#a)" ${IO}/><circle cx="34" cy="34" r="16" fill="url(#b)" stroke="#8A5A12" stroke-width="2"/><path d="M24 30a11 11 0 0 1 9-9" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>` },
    wizard: { n: 'Wizard Hat', slot: 'hat', r: '#B98CFF', defs: g('a', '#9A63F0', '#5B2E9E'), body: `<ellipse cx="42" cy="64" rx="36" ry="10" fill="#4B2490" ${IO}/><path d="M22 62C28 42 32 24 46 6c3 9 8 14 16 17-4 10-2 26 2 39z" fill="url(#a)" ${IO}/><path d="M24 54q20 6 38 0l2 8q-20 6-42 0z" fill="#F2C14E" ${IO}/><path d="M38 30l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#FFE27A"/>` },
    shades: { n: 'Star Shades', slot: 'eyes', r: '#4DA3FF', defs: g('a', '#FF9CC6', '#E0457F') + g('b', '#5A3B7A', '#1E1233'), body: `<path d="M34 32q8-6 16 0" stroke="#1B1230" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M34 32q8-6 16 0" stroke="#FF7FB5" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M4 34c8-6 22-8 30-4 2 10-2 20-14 20C8 50 4 42 4 34z" fill="url(#a)" ${IO}/><path d="M80 34c-8-6-22-8-30-4-2 10 2 20 14 20 12 0 16-8 16-16z" fill="url(#a)" ${IO}/><path d="M10 36c5-3 14-4 20-2 0 7-3 12-10 12-7 0-10-4-10-10z" fill="url(#b)"/><path d="M74 36c-5-3-14-4-20-2 0 7 3 12 10 12 7 0 10-4 10-10z" fill="url(#b)"/><path d="M15 38l6-2M59 38l6-2" stroke="#fff" stroke-opacity=".8" stroke-width="2.5" stroke-linecap="round"/>` },
  };
  // Items sold in the Market (same drawing style as the design's wardrobe items).
  Object.assign(ITEMS, {
    crown: { n: 'Royal Crown', slot: 'hat', r: '#F2B84B', price: 1500, defs: g('a', '#FFE59A', '#D9962B'), body: `<path d="M12 60L8 26l18 14 16-24 16 24 18-14-4 34z" fill="url(#a)" ${IO}/><rect x="11" y="56" width="62" height="13" rx="5" fill="#C98522" ${IO}/><circle cx="42" cy="44" r="6" fill="#E5484D" ${IO}/><circle cx="25" cy="48" r="4" fill="#4DA3FF" ${IO}/><circle cx="59" cy="48" r="4" fill="#8BEB6E" ${IO}/><circle cx="8" cy="25" r="4" fill="#FFF1C4" ${IO}/><circle cx="42" cy="15" r="4" fill="#FFF1C4" ${IO}/><circle cx="76" cy="25" r="4" fill="#FFF1C4" ${IO}/><path d="M20 34l6 5" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>` },
    viking: { n: 'Viking Helmet', slot: 'hat', r: '#B98CFF', price: 900, defs: g('a', '#CFE0E6', '#6F8C96'), body: `<path d="M22 46C10 42 4 30 8 14c4 10 10 17 20 19z" fill="#FFF1D6" ${IO}/><path d="M62 46c12-4 18-16 14-32-4 10-10 17-20 19z" fill="#FFF1D6" ${IO}/><path d="M18 60C18 38 28 24 42 24s24 14 24 36z" fill="url(#a)" ${IO}/><path d="M42 25v32" stroke="#4F6873" stroke-width="3"/><path d="M26 36q6-8 14-9" stroke="#fff" stroke-opacity=".7" stroke-width="3.5" fill="none" stroke-linecap="round"/><rect x="13" y="54" width="58" height="13" rx="5" fill="#B8741F" ${IO}/><circle cx="24" cy="60.5" r="2.2" fill="#FFE59A"/><circle cx="42" cy="60.5" r="2.2" fill="#FFE59A"/><circle cx="60" cy="60.5" r="2.2" fill="#FFE59A"/>` },
    eyepatch: { n: 'Pirate Patch', slot: 'eyes', r: '#4DA3FF', price: 350, defs: g('a', '#3A2A4A', '#120A1C'), body: `<path d="M2 30Q42 16 82 30" stroke="#1B1230" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M2 30Q42 16 82 30" stroke="#5A3B2A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M46 28c12-5 24-3 26 6 2 11-6 19-15 19s-15-7-14-15z" fill="url(#a)" ${IO}/><path d="M53 33l10 5M63 33l-10 5" stroke="#F2C14E" stroke-width="2.6" stroke-linecap="round"/>` },
    hearts: { n: 'Heart Shades', slot: 'eyes', r: '#FF6FA0', price: 500, defs: g('a', '#FF9CC6', '#E0457F'), body: `<path d="M34 32q8-6 16 0" stroke="#1B1230" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M34 32q8-6 16 0" stroke="#FFD1E3" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M19 28c-6-9-19-5-17 6 1 9 17 19 17 19s16-10 17-19c2-11-11-15-17-6z" fill="url(#a)" ${IO}/><path d="M65 28c-6-9-19-5-17 6 1 9 17 19 17 19s16-10 17-19c2-11-11-15-17-6z" fill="url(#a)" ${IO}/><path d="M9 32l4-3M55 32l4-3" stroke="#fff" stroke-opacity=".85" stroke-width="2.6" stroke-linecap="round"/>` },
    scarf: { n: 'Fan Scarf', slot: 'extra', r: '#9FB3BD', price: 400, defs: g('a', '#FFE27A', '#F2B83B') + g('b', '#3E6FD8', '#16275E'), body: `<path d="M8 18q34 20 68 0l4 14q-38 22-76 0z" fill="url(#a)" ${IO}/><path d="M22 26l-3 13M38 30l-1 13M54 28l2 13" stroke="#16275E" stroke-width="5"/><path d="M50 32l4 38 14-3-6-37z" fill="url(#b)" ${IO}/><path d="M53 46l11-2M54 57l12-2" stroke="#FFE27A" stroke-width="4"/><path d="M56 70v6M61 69v6M66 68v6" stroke="#1B1230" stroke-width="2.4" stroke-linecap="round"/>` },
    chain: { n: 'Gold Chain', slot: 'extra', r: '#B98CFF', price: 1200, defs: g('a', '#FFE59A', '#C98522'), body: `<path d="M10 14q32 44 64 0" stroke="#1B1230" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M10 14q32 44 64 0" stroke="#F2C14E" stroke-width="4.5" fill="none" stroke-dasharray="5 3" stroke-linecap="round"/><circle cx="42" cy="54" r="17" fill="url(#a)" ${IO}/><circle cx="42" cy="54" r="11" fill="none" stroke="#8A5A12" stroke-width="2"/><path d="M42 46l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z" fill="#FFF4C9" stroke="#8A5A12" stroke-width="1.2" stroke-linejoin="round"/>` },
  });
  ['pirate', 'wizard', 'beanie', 'goggles', 'shades', 'monocle'].forEach((k) => { ITEMS[k].price = 0; });
  const RARITY = { '#9FB3BD': 'Common', '#4DA3FF': 'Rare', '#FF6FA0': 'Rare', '#B98CFF': 'Epic', '#F2B84B': 'Legendary' };
  const item = (k) => svgWrap(ITEMS[k].defs, ITEMS[k].body, '0 0 84 84');

  /* icons */
  const I = (p, c = '#9FB3BD', s = 24, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const P = {
    bell: '<path d="M6 8.5a6 6 0 0 1 12 0c0 6.5 2.5 8.5 2.5 8.5h-17S6 15 6 8.5"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0"/>',
    volume: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    wallet: '<path d="M19 7V5a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4"/><path d="M3 6v12a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-3"/><path d="M17 12h4v4h-4a2 2 0 0 1 0-4z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>',
    swap: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/>',
    userplus: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3.1-6 7-6s7 2 7 6"/><path d="M19 8v6M16 11h6"/>',
    hanger: '<path d="M12 7a2 2 0 1 1 2-2c0 1.2-2 1.8-2 3v1"/><path d="M12 9 3 16.5a1.5 1.5 0 0 0 1 2.5h16a1.5 1.5 0 0 0 1-2.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    shirt: '<path d="M20.4 6.6 16 4a4 4 0 0 1-8 0L3.6 6.6a1 1 0 0 0-.5 1.2l1.3 3.6a1 1 0 0 0 1.2.6L7 11.6V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8.4l1.4.4a1 1 0 0 0 1.2-.6l1.3-3.6a1 1 0 0 0-.5-1.2z"/>',
    cake: '<path d="M4 21V13a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><path d="M4 16c2 1 4 1 6 0s4-1 6 0 4 1 4 0"/><path d="M2 21h20M12 11V7M12 4.5v.01"/>',
    at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    check: '<path d="M5 12.5 10 17 19 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    ball: '<circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 4.5h-5L8 10z"/><path d="M12 3v4M21 10l-5 0M16.5 20l-2-5.5M7.5 20l2-5.5M3 10h5"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    bag: '<path d="M6 7h12l1 13H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v7M12 14v7M3 12h7M14 12h7M5.6 5.6l5 5M13.4 13.4l5 5M18.4 5.6l-5 5M10.6 13.4l-5 5"/>',
    coin: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 9.5v5"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
    crown: '<path d="M3 18 2 7l5 4 5-7 5 7 5-4-1 11z"/>',
    gem: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6 4 6z"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.5L22 8H6"/>',
  };

  /* shared chrome */
  const status = () => `<div class="status"><span>9:41</span><svg width="68" height="12" viewBox="0 0 68 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#fff"/><rect x="5" y="6" width="3" height="6" rx="1" fill="#fff"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#fff"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#fff"/><path d="M25 4.5a9 9 0 0 1 12 0M27.5 7a5.5 5.5 0 0 1 7 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="31" cy="10" r="1.4" fill="#fff"/><rect x="42.5" y=".5" width="22" height="11" rx="3" stroke="#fff" stroke-opacity=".5" fill="none"/><rect x="44.5" y="2.5" width="16" height="7" rx="1.6" fill="#fff"/></svg></div>`;
  const rays = () => `<div class="rays"><div class="glow"></div><i style="left:40px;width:60px;transform:rotate(18deg)"></i><i style="left:160px;width:40px;transform:rotate(12deg)"></i><i style="left:270px;width:70px;transform:rotate(8deg)"></i></div>`;
  const balance = () => `<div class="bal"><div class="coin"><svg width="16" height="16" viewBox="0 0 24 24"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" fill="#FFF4C9" stroke="#A86E17" stroke-width="1.6"/></svg></div><div><small>Balance</small><b data-bal-num>${window.APP ? APP.fmtBalance() : '1,250'}</b></div><div class="btn-gold topup" data-action="topup">+ Top up</div></div>`;
  const pedestal = (w = 220) => `<svg class="pedestal" width="${w}" height="${w * 0.5}" viewBox="0 0 112 56"><defs><linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5DA7A0"/><stop offset="1" stop-color="#2B5F62"/></linearGradient><linearGradient id="pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6E3D8"/><stop offset="1" stop-color="#6DB5AB"/></linearGradient></defs><ellipse cx="56" cy="52" rx="52" ry="4" fill="#000" fill-opacity=".35"/><path d="M10 16h92v26a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8z" fill="url(#pf)" stroke="#123A3C" stroke-width="2.5"/><path d="M14 30h84" stroke="#1E4E4C" stroke-width="2"/><ellipse cx="56" cy="16" rx="50" ry="11" fill="url(#pt)" stroke="#123A3C" stroke-width="2.5"/><ellipse cx="56" cy="13" rx="38" ry="5" fill="#fff" fill-opacity=".3"/><path d="M4 54c-2-8 0-14 3-18m0 0c-2-3-3-6-1-9m1 9c2-3 5-4 8-4" stroke="#FF6FA0" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M108 54c2-7 1-12-2-15m0 0c2-2 3-5 2-8m-2 8c-2-2-5-3-8-2" stroke="#FF9A3C" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`;

  /* worn items overlay on the character (positions relative to a 100x100 avatar box) */
  function wearing(key, hat, eyes, extra) {
    const pos = {
      hat: { shark: [16, -20, 68], octopus: [16, -22, 68], turtle: [16, -16, 68], crab: [20, -10, 60], puffer: [16, -14, 68] },
      eyes: { shark: [14, 20, 72], octopus: [14, 22, 72], turtle: [18, 36, 64], crab: [18, 4, 64], puffer: [14, 24, 72] },
      extra: { shark: [16, 60, 68], octopus: [16, 58, 68], turtle: [20, 74, 60], crab: [20, 62, 60], puffer: [16, 66, 68] },
    };
    let h = '';
    if (extra) { const [l, t, w] = pos.extra[key]; h += `<div class="worn" style="left:${l}%;top:${t}%;width:${w}%;height:${w}%">${item(extra)}</div>`; }
    if (eyes) { const [l, t, w] = pos.eyes[key]; h += `<div class="worn" style="left:${l}%;top:${t}%;width:${w}%;height:${w}%">${item(eyes)}</div>`; }
    if (hat) { const [l, t, w] = pos.hat[key]; h += `<div class="worn" style="left:${l}%;top:${t}%;width:${w}%;height:${w}%">${item(hat)}</div>`; }
    return h;
  }

  /* ============ STATE (saved in this browser) ============ */
  const KEY = 'sharko.profile.v1';
  const STATE = {
    animal: 'shark', hat: 'pirate', eyes: null, extra: null, owned: ['pirate', 'wizard', 'beanie', 'goggles', 'shades', 'monocle'],
    details: { email: 'or.captain@gmail.com', phone: '+972 50-123-4567', country: 'Israel', team: 'MTA', birthday: '1998-03-14' },
    settings: { sound: true, alerts: true, reminders: true, vibration: true, online: true, lang: 'en' },
  };
  try { Object.assign(STATE, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* use defaults */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(STATE)); } catch (e) { /* ignore */ } };
  const toast = (m) => window.APP && APP.toast(m);
  const userName = () => (window.APP ? APP.userName() : 'CaptainOr');
  const handle = () => userName().toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const FRIEND_CODE = 'OR-4827';
  const inviteLink = () => `https://sharko.app/join/${FRIEND_CODE}`;
  const COUNTRIES = ['Israel', 'England', 'Spain', 'Italy', 'Germany', 'France', 'USA', 'Other'];
  const FAV_TEAM_KEYS = ['MTA', 'HBS', 'MHA', 'HTA', 'BEI', 'LIV', 'MCI', 'ARS', 'RMA', 'BAR', 'INT', 'FCB'];
  const teamLabel = (k) => (typeof TEAMS !== 'undefined' && TEAMS[k] ? TEAMS[k][0] : k);
  const fmtBirthday = (iso) => { if (!iso) return 'Not set'; const d = new Date(`${iso}T12:00:00`); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };
  const escA = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ============ FRIENDS (demo data) ============ */
  const FRIEND_NAMES = [['octopus', 'Maya', 1], ['crab', 'Tomer', 1], ['turtle', 'Noa', 0], ['puffer', 'Eden', 1], ['shark', 'Daniel', 0], ['octopus', 'Lior', 0],
    ['turtle', 'Yael', 1], ['shark', 'Amit', 0], ['crab', 'Shira', 1], ['puffer', 'Omer', 0], ['octopus', 'Gal', 1], ['shark', 'Roni', 0],
    ['turtle', 'Itay', 0], ['crab', 'Tamar', 1], ['puffer', 'Ido', 0], ['octopus', 'Michal', 0], ['shark', 'Yonatan', 1], ['turtle', 'Hila', 0],
    ['crab', 'Ben', 0], ['puffer', 'Dana', 1], ['octopus', 'Eyal', 0], ['shark', 'Neta', 0], ['turtle', 'Alon', 1], ['crab', 'Rotem', 0]];
  const FAV_TEAMS = ['Maccabi Tel Aviv', 'Hapoel Be\'er Sheva', 'Maccabi Haifa', 'Liverpool', 'Real Madrid', 'Barcelona', 'Man City', 'Beitar Jerusalem'];
  const FRIENDS = FRIEND_NAMES.map(([animalKey, name, online], i) => {
    // stable pseudo-random numbers per friend (same values on every visit)
    const r = (n) => { let t = (i + 1) * 2654435761 + n * 40503 >>> 0; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const matches = 12 + Math.floor(r(1) * 70);
    const wins = Math.floor(matches * (0.3 + r(2) * 0.45));
    const form = Array.from({ length: 5 }, (_, j) => { const x = r(10 + j); return x < 0.45 ? 'W' : x < 0.7 ? 'D' : 'L'; });
    return {
      animal: animalKey, name, online: !!online, handle: name.toLowerCase() + (i % 3 ? '_' + (10 + i) : ''),
      level: 3 + Math.floor(r(3) * 22), matches, wins, rate: Math.round((wins / matches) * 100), lobbies: Math.floor(r(4) * 18),
      coins: 400 + Math.floor(r(5) * 9000), team: FAV_TEAMS[Math.floor(r(6) * FAV_TEAMS.length)], form,
      h2h: [Math.floor(r(7) * 6), Math.floor(r(8) * 6)], last: online ? 'Online now' : `Last seen ${1 + Math.floor(r(9) * 23)}h ago`,
    };
  });

  /* ============ SCREEN 1 : PROFILE ============ */
  function profileHTML() {
    const a = ANIMALS[STATE.animal];
    const st = STATS.view(season);
    const ach = STATS.achievements(achCtx());
    const friends = FRIENDS.slice(0, 6).map((f) => [f.animal, f.name, f.online ? 1 : 0]);
    return `${rays()}<div class="scroll">${status()}
  <div class="topbar">${balance()}<div class="iconbtn" onclick="PS.openSettings()" aria-label="Settings">${I(P.gear, '#F6D58A', 22)}<span class="dot"></span></div></div>
  <div class="hero"><div class="stage"></div>
    <div class="avatar-wrap" onclick="PS.openPicker()">
      <div class="ring"><div class="inner">${animal(STATE.animal)}</div></div>
      <div style="position:absolute;inset:8px;overflow:visible">${wearing(STATE.animal, STATE.hat, STATE.eyes, STATE.extra)}</div>
      <span class="gem" style="left:-4px;top:66px"></span><span class="gem" style="right:-4px;top:40px"></span>
      <div class="btn-gold swap">${I(P.swap, '#2B1A04', 20, 2.6)}</div>
      <div class="tap-hint"><svg width="24" height="20" viewBox="0 0 24 20"><path d="M22 2C14 2 8 8 4 16m0 0 6-1M4 16l-1-6" stroke="#F6D58A" stroke-width="2" fill="none" stroke-linecap="round"/></svg>TAP TO<br>CHANGE!</div>
    </div>
    <div class="name"><h1>${userName()}</h1><div class="pencil" onclick="PS.openEdit('name')" aria-label="Edit name">${I(P.pencil, '#F6D58A', 16, 2.4)}</div></div>
    <div class="handle">@${handle()} <span style="opacity:.4">•</span> <span class="flag">${STATE.details.country === 'Israel' ? israelFlag() : '🌍'} ${escA(STATE.details.country)}</span> <span style="opacity:.4">•</span> ${a.kind} crew</div>
  </div>


  <div class="actions">
    <div class="act gold" onclick="PS.openWardrobe()">${I(P.hanger, '#2B1A04', 24, 2.4)}WARDROBE<span class="badge">${STATE.owned.length}</span></div>
    <div class="act teal" onclick="PS.openEdit()">${I(P.pencil, '#fff', 22, 2.6)}EDIT PROFILE</div>
    <div class="act green" onclick="PS.openAdd()">${I(P.userplus, '#fff', 22, 2.6)}ADD FRIEND</div>
  </div>

  <div class="sec"><h2>MY STATS</h2><span class="link" onclick="PS.toggleSeason()">${season ? 'This season' : 'All time'} ▾</span></div>
  <div class="stats">
    ${[['ball', '#4DA3FF', fmtN(st.matches), 'Matches'], ['trophy', '#F2B84B', fmtN(st.wins), 'Wins'], ['target', '#E5484D', `${st.matches ? Math.round((st.wins / st.matches) * 100) : 0}%`, 'Win rate'], ['flag', '#8BEB6E', fmtN(st.hosted), 'Lobbies']].map(([i, c, v, l]) => `<div class="card stat"><div class="ic" style="background:${c}">${I(P[i], '#1B1230', 20, 2.4)}</div><b>${v}</b><span>${l}</span></div>`).join('')}
  </div>

  <div class="sec"><h2>FRIENDS <span class="chip">${FRIENDS.length}</span></h2><span class="link" onclick="PS.openFriends()">See all ›</span></div>
  <div class="friends">
    <div class="fr add" onclick="PS.openAdd()"><div class="av">${I(P.userplus, '#8BEB6E', 24, 2.4)}</div><span>Invite</span></div>
    ${friends.map(([k, n, on], i) => `<div class="fr" onclick="PS.openFriend(${i})"><div class="av"><div class="clip">${animal(k)}</div>${on ? '<span class="on"></span>' : ''}</div><span>${n}</span></div>`).join('')}
  </div>

  <div class="sec"><h2>MY DETAILS</h2><span class="link" style="display:flex;gap:4px;align-items:center" onclick="PS.openEdit()">${I(P.pencil, '#F6D58A', 13, 2.6)} Edit</span></div>
  <div class="card details">
    ${[['at', 'Username', '@' + handle(), 'name'], ['mail', 'Email', STATE.details.email, 'email'], ['phone', 'Phone', STATE.details.phone || 'Not set', 'phone'], ['globe', 'Country', STATE.details.country, 'country'], ['shirt', 'Favorite team', teamLabel(STATE.details.team), 'team'], ['cake', 'Birthday', fmtBirthday(STATE.details.birthday), 'birthday']].map(([i, k, v, f]) => `<div class="drow" onclick="PS.openEdit('${f}')"><div class="di">${I(P[i], '#F6D58A', 17, 2.2)}</div><div class="grow"><div class="k">${k}</div><div class="v">${escA(v)}</div></div><span class="chev">›</span></div>`).join('')}
  </div>

  <div class="sec"><h2>ACHIEVEMENTS <span class="chip">${ach.filter((x) => x.done).length}/${ach.length}</span></h2><span class="link" onclick="PS.openAchievements()">See all ›</span></div>
  <div class="ach">
    ${ach.slice(0, 4).map((x) => `<div onclick="PS.openAchievements()" style="cursor:pointer">${medal(x.c[0], x.c[1], x.icon, x.name, !x.done)}</div>`).join('')}
  </div>
  <div class="logout" onclick="AUTH.logout()">${I(P.logout, '#FF8A8E', 18, 2.4)} Log out</div>
  </div>`;
  }
  function medal(c1, c2, ic, label, locked) {
    return `<div class="card medal ${locked ? 'locked' : ''}"><svg width="54" height="58" viewBox="0 0 54 58"><defs><linearGradient id="m${label.length}${c1.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><path d="M17 40 12 56l8-4 5 6 3-14M37 40l5 16-8-4-5 6-3-14" fill="#E5484D" stroke="#1B1230" stroke-width="2.5" stroke-linejoin="round"/><path d="M27 2 48 14v22L27 48 6 36V14z" fill="url(#m${label.length}${c1.slice(1)})" stroke="#1B1230" stroke-width="3" stroke-linejoin="round"/><path d="M27 8 43 17v16L27 42 11 33V17z" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2"/><g transform="translate(16 14)">${`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B1230" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${P[ic]}</svg>`}</g>${locked ? '<rect x="19" y="18" width="16" height="13" rx="3" fill="#1B1230"/><path d="M22 18v-3a5 5 0 0 1 10 0v3" stroke="#1B1230" stroke-width="3" fill="none"/>' : ''}</svg><span>${label}</span></div>`;
  }
  function israelFlag() { return `<svg width="18" height="13" viewBox="0 0 18 13" style="border-radius:2px"><rect width="18" height="13" fill="#fff"/><rect y="1.5" width="18" height="1.6" fill="#1F5FD1"/><rect y="9.9" width="18" height="1.6" fill="#1F5FD1"/><path d="M9 3.8 11 7.3H7zM9 9.2 7 5.7h4z" fill="none" stroke="#1F5FD1" stroke-width=".9"/></svg>`; }

  /* ============ SCREEN 2 : AVATAR PICKER ============ */
  function pickerHTML(sel) {
    const a = ANIMALS[sel];
    return `<div class="dim" onclick="PS.closeSheet()"></div><div class="sheet">
    <div class="plate">CHOOSE YOUR CREW</div>
    <div class="close" onclick="PS.closeSheet()">${I(P.x, '#fff', 16, 3.2)}</div>
    <div class="preview"><div class="big">${animal(sel)}</div><div><h4>${a.name} the ${a.kind}</h4><p>${a.desc}</p><div class="traits">${a.traits.map((t) => `<span>${t}</span>`).join('')}</div></div></div>
    <div class="picks">${Object.keys(ANIMALS).map((k) => `<div class="pick ${k === sel ? 'sel' : ''}" onclick="PS.choose('${k}')"><div class="pa">${animal(k)}</div><span>${ANIMALS[k].kind === 'Pufferfish' ? 'Puffer' : ANIMALS[k].kind}</span>${k === sel ? `<div class="check">${I(P.check, '#fff', 13, 3.4)}</div>` : ''}</div>`).join('')}</div>
    <div class="bigbtn" onclick="PS.saveAnimal('${sel}')">${I(P.check, '#2B1A04', 22, 3.2)} SAVE AVATAR</div>
  </div>`;
  }

  /* ============ ADD FRIEND ============ */
  const sentReq = new Set(['Noa Mizrahi']);
  const SUGGESTED = [['crab', 'Tomer Levi', '@tomer_l', '4 mutual friends'], ['puffer', 'Eden Cohen', '@edenc', 'Also a Maccabi fan'], ['turtle', 'Noa Mizrahi', '@noa.m', '2 mutual friends'], ['octopus', 'Yael Ben-David', '@yael_bd', 'In your contacts'],
    ['shark', 'Amir Katz', '@amirk', '3 mutual friends'], ['crab', 'Lihi Peretz', '@lihi.p', 'Plays Ligat Ha\'Al lobbies'], ['puffer', 'Omri Shalev', '@omri_s', '1 mutual friend'], ['octopus', 'Shani Azulay', '@shani_a', 'Also a Liverpool fan'],
    ['turtle', 'Guy Friedman', '@guyf', '5 mutual friends'], ['shark', 'Maor Biton', '@maor.b', 'Top 10 this week'], ['crab', 'Rina Golan', '@rina_g', 'In your contacts'], ['puffer', 'Erez Dahan', '@erezd', '2 mutual friends']];
  const personRow = ([k, n, h, m]) => { const sent = sentReq.has(n); return `<div class="person" data-q="${escA((n + ' ' + h).toLowerCase())}"><div class="pa">${animal(k)}</div><div class="grow"><div class="n">${escA(n)}</div><div class="h">${escA(h)} · ${escA(m)}</div></div><div class="addbtn ${sent ? 'sent' : ''}" onclick="PS.sendReq(this,'${escA(n)}')">${sent ? '✓ SENT' : `${I(P.userplus, '#fff', 15, 2.8)} ADD`}</div></div>`; };
  function addHTML() {
    const ppl = SUGGESTED.slice(0, 4);
    return `<div class="dim" onclick="PS.closeSheet()"></div><div class="sheet tallsheet">
    <div class="plate">ADD FRIENDS</div>
    <div class="close" onclick="PS.closeSheet()">${I(P.x, '#fff', 16, 3.2)}</div>
    <div class="search" style="margin-top:14px">${I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', '#A9BCC4', 20, 2.4)}<input id="friend-search" placeholder="Search by username or phone" oninput="PS.searchPeople(this.value)"></div>
    <div class="ways">
      <div class="way purple" onclick="PS.openShare()">${I('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>', '#fff', 22, 2.6)}SHARE LINK</div>
      <div class="act teal" style="height:78px" onclick="PS.openContacts()">${I('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>', '#fff', 22, 2.6)}CONTACTS</div>
      <div class="act gold" style="height:78px" onclick="PS.openQR()">${I('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>', '#2B1A04', 22, 2.6)}QR CODE</div>
    </div>
    <div class="code"><div><div class="k">Your friend code</div><div class="v">OR-4827</div></div><div class="copy btn-gold" onclick="PS.copyCode()">${I('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>', '#2B1A04', 16, 2.6)}COPY</div></div>
    <div class="subh"><b>SUGGESTED FOR YOU</b><span class="link" onclick="PS.openSuggested()">See all ›</span></div>
    <div class="sug">${ppl.map(([k, n, h, m]) => { const sent = sentReq.has(n); return `<div class="person" data-q="${(n + ' ' + h).toLowerCase()}"><div class="pa">${animal(k)}</div><div class="grow"><div class="n">${n}</div><div class="h">${h} · ${m}</div></div><div class="addbtn ${sent ? 'sent' : ''}" onclick="PS.sendReq(this,'${n}')">${sent ? '✓ SENT' : `${I(P.userplus, '#fff', 15, 2.8)} ADD`}</div></div>`; }).join('')}</div>
  </div>`;
  }

  /* ============ SCREEN 3 : WARDROBE ============ */
  let wardTab = 'ALL';
  function wardrobeHTML() {
    const tabs = { ALL: () => true, HATS: (k) => ITEMS[k].slot === 'hat', EYES: (k) => ITEMS[k].slot === 'eyes', EXTRAS: (k) => ITEMS[k].slot === 'extra' };
    const inv = STATE.owned.filter(tabs[wardTab]);
    const isOn = (k) => STATE.hat === k || STATE.eyes === k || STATE.extra === k;
    return `${rays()}<div class="scroll">${status()}
  <div class="topbar">${balance()}<div class="iconbtn" onclick="PS.openProfile()" aria-label="Back">${I('<path d="m15 18-6-6 6-6"/>', '#F6D58A', 24, 2.6)}</div></div>
  <div class="wtitle"><div class="woodsign"><b>WARDROBE</b></div></div>
  <div class="mannequin"><div class="spot"></div>${pedestal(240)}
    <div class="char"><div class="clip">${animal(STATE.animal)}</div><div style="position:absolute;inset:0">${wearing(STATE.animal, STATE.hat, STATE.eyes, STATE.extra)}</div></div>
    <div class="side" style="left:20px;top:40px"><div class="slotbtn ${STATE.hat ? 'fill' : ''}" onclick="PS.tab('HATS')">${STATE.hat ? `<div style="width:36px;height:36px">${item(STATE.hat)}</div>` : I(P.hanger, '#4F6873', 22, 2)}<small>HEAD</small></div><div class="slotbtn ${STATE.eyes ? 'fill' : ''}" style="margin-top:12px" onclick="PS.tab('EYES')">${STATE.eyes ? `<div style="width:36px;height:36px">${item(STATE.eyes)}</div>` : I('<circle cx="7" cy="14" r="4"/><circle cx="17" cy="14" r="4"/><path d="M11 14h2"/>', '#4F6873', 24, 2)}<small>EYES</small></div></div>
    <div class="side" style="right:20px;top:40px"><div class="slotbtn ${STATE.extra ? 'fill' : ''}" onclick="PS.tab('EXTRAS')">${STATE.extra ? `<div style="width:36px;height:36px">${item(STATE.extra)}</div>` : I(P.bag, '#4F6873', 22, 2)}<small>EXTRA</small></div><div class="slotbtn" style="margin-top:12px" onclick="PS.randomLook()">${I(P.swap, '#F6D58A', 22, 2.4)}<small>RANDOM</small></div></div>
  </div>
  <div class="tabs">${['ALL', 'HATS', 'EYES', 'EXTRAS'].map((t) => `<div class="${t === wardTab ? 'on' : ''}" onclick="PS.tab('${t}')">${t}</div>`).join('')}</div>
  <div class="inv">${inv.length ? inv.map((k) => `<div class="it ${isOn(k) ? 'eq' : ''}"><span class="rar" style="background:${ITEMS[k].r}"></span><div class="art">${item(k)}</div><div class="nm">${ITEMS[k].n}</div><div class="pill ${isOn(k) ? 'on' : 'equip'}" onclick="PS.equip('${k}')">${isOn(k) ? '✓ WEARING' : 'EQUIP'}</div></div>`).join('') : `<div class="empty-inv">Nothing here yet. Find more in the Market.</div>`}</div>
  <div class="more" data-go="market">${I(P.wallet, '#F6D58A', 18, 2.2)} Get more items in the Market ›</div>
  <div class="bigbtn" style="margin:14px 16px 0" onclick="PS.saveLook()">SAVE LOOK</div>
  </div>`;
  }

  /* ============ FRIENDS LIST ============ */
  let friendTab = 'ALL';
  let friendQuery = '';
  function friendsHTML() {
    const online = FRIENDS.filter((f) => f.online).length;
    return `${rays()}<div class="scroll">${status()}
  <div class="topbar">${balance()}<div class="iconbtn" onclick="PS.openProfile()" aria-label="Back">${I('<path d="m15 18-6-6 6-6"/>', '#F6D58A', 24, 2.6)}</div></div>
  <div class="wtitle"><div class="woodsign"><b>FRIENDS</b></div></div>
  <div class="search" style="margin:16px 16px 0">${I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', '#A9BCC4', 20, 2.4)}<input id="fl-search" placeholder="Search friends" value="${friendQuery.replace(/"/g, '&quot;')}" oninput="PS.filterFriends(this.value)"></div>
  <div class="tabs"><div class="${friendTab === 'ALL' ? 'on' : ''}" onclick="PS.friendTab('ALL')">ALL ${FRIENDS.length}</div><div class="${friendTab === 'ONLINE' ? 'on' : ''}" onclick="PS.friendTab('ONLINE')"><span class="ondot"></span>ONLINE ${online}</div></div>
  <div class="sug fl-list" id="fl-list">${friendRows()}</div>
  <div class="more" onclick="PS.openAdd()">${I(P.userplus, '#F6D58A', 18, 2.2)} Add more friends</div>
  </div>`;
  }
  function friendRows() {
    const q = friendQuery.trim().toLowerCase();
    const list = FRIENDS.map((f, i) => [f, i]).filter(([f]) => (friendTab === 'ALL' || f.online) && (!q || (f.name + ' ' + f.handle).toLowerCase().includes(q)));
    if (!list.length) return '<div class="empty-inv">No friends match your search.</div>';
    return list.map(([f, i]) => `<div class="person fl-row" onclick="PS.openFriend(${i})"><div class="pa fl-av">${animal(f.animal)}${f.online ? '<span class="fl-on"></span>' : ''}</div><div class="grow"><div class="n">${f.name} <span class="fl-lvl">LV ${f.level}</span></div><div class="h">@${f.handle} · ${f.last}</div></div><div class="fl-rate"><b>${f.rate}%</b><small>WIN RATE</small></div><span class="fl-chev">›</span></div>`).join('');
  }
  function friendSheet(i) {
    const f = FRIENDS[i];
    const formClass = { W: 'w', D: 'd', L: 'l' };
    return `<div class="dim" onclick="PS.closeSheet()"></div><div class="sheet fr-sheet">
    <div class="plate">${f.name.toUpperCase()}</div>
    <div class="close" onclick="PS.closeSheet()">${I(P.x, '#fff', 16, 3.2)}</div>
    <div class="preview"><div class="big">${animal(f.animal)}</div><div>
      <h4>${f.name}</h4><p>@${f.handle}</p>
      <div class="traits"><span class="fr-lv">LEVEL ${f.level}</span><span class="${f.online ? 'fr-online' : 'fr-off'}">${f.online ? '● ONLINE' : f.last.toUpperCase()}</span></div>
      <p class="fr-team">${I(P.shirt, '#F6D58A', 14, 2.2)} ${f.team}</p>
    </div></div>
    <div class="stats fr-stats">
      ${[['ball', '#4DA3FF', f.matches, 'Matches'], ['trophy', '#F2B84B', f.wins, 'Wins'], ['target', '#E5484D', f.rate + '%', 'Win rate'], ['flag', '#8BEB6E', f.lobbies, 'Lobbies']].map(([ic, c, v, l]) => `<div class="card stat"><div class="ic" style="background:${c}">${I(P[ic], '#1B1230', 20, 2.4)}</div><b>${v}</b><span>${l}</span></div>`).join('')}
    </div>
    <div class="fr-row2">
      <div class="card fr-box"><small>RECENT FORM</small><div class="fr-form">${f.form.map((x) => `<i class="${formClass[x]}">${x}</i>`).join('')}</div></div>
      <div class="card fr-box"><small>YOU VS ${f.name.toUpperCase()}</small><div class="fr-h2h"><b>${f.h2h[0]}</b><span>:</span><b>${f.h2h[1]}</b></div></div>
    </div>
    <div class="card fr-box fr-coins"><small>COINS WON THIS SEASON</small><b>${f.coins.toLocaleString('en-US')}</b></div>
    <div class="bigbtn" onclick="PS.inviteFriend(${i})">${I(P.userplus, '#2B1A04', 22, 2.8)} INVITE TO PARTY</div>
  </div>`;
  }

  /* ============ ACHIEVEMENTS (See all) ============ */
  let season = true;
  const fmtN = (n) => n.toLocaleString('en-US');
  const achCtx = () => ({ owned: STATE.owned.length });
  function achievementsHTML() {
    const list = STATS.achievements(achCtx());
    const done = list.filter((x) => x.done).length;
    const earned = list.filter((x) => x.claimed).reduce((n, x) => n + x.reward, 0);
    const toClaim = list.filter((x) => x.done && !x.claimed).length;
    // Ready to claim first, then in progress, then claimed.
    const order = (x) => (x.done && !x.claimed ? 0 : !x.done ? 1 : 2);
    return `${rays()}<div class="scroll">${status()}
  <div class="topbar">${balance()}<div class="iconbtn" onclick="PS.openProfile()" aria-label="Back">${I('<path d="m15 18-6-6 6-6"/>', '#F6D58A', 24, 2.6)}</div></div>
  <div class="wtitle"><div class="woodsign"><b>ACHIEVEMENTS</b></div></div>
  <div class="card ach-sum">
    <div class="ach-sum-row"><div><small>UNLOCKED</small><b>${done}<span>/${list.length}</span></b></div><div><small>COINS EARNED</small><b class="gold">${fmtN(earned)}</b></div>${toClaim ? `<div class="ach-ready">${toClaim} TO CLAIM</div>` : ''}</div>
    <div class="ach-bar"><i style="width:${Math.round((done / list.length) * 100)}%"></i></div>
  </div>
  <div class="ach-list">${list.slice().sort((x, y) => order(x) - order(y)).map((x) => `
    <div class="card ach-row ${x.done ? 'done' : ''}">
      <div class="ach-medal">${medal(x.c[0], x.c[1], x.icon, '', !x.done)}</div>
      <div class="ach-txt"><b>${x.name}</b><small>${x.desc}</small>
        <div class="ach-prog"><i style="width:${Math.round((x.progress / x.target) * 100)}%"></i></div>
        <span class="ach-num">${fmtN(x.progress)} / ${fmtN(x.target)}</span></div>
      ${x.done && !x.claimed ? `<div class="ach-claim" onclick="PS.claim('${x.id}')">CLAIM<br><span>+${x.reward}</span></div>`
        : x.claimed ? '<div class="ach-claimed">✓<br>CLAIMED</div>' : `<div class="ach-reward">+${x.reward}<br><span>COINS</span></div>`}
    </div>`).join('')}</div>
  </div>`;
  }
  const checkAchievements = () => {
    STATS.newlyDone(achCtx()).forEach((x, i) => setTimeout(() => toast(`🏆 Achievement unlocked: ${x.name}! Claim it in your Profile`), 600 + i * 2800));
  };

  /* ============ EDIT PROFILE ============ */
  let editDraft = null; let editFocus = null; let editErrors = {};
  function editHTML() {
    const d = editDraft;
    const field = (id, label, icon, input) => `<div class="ef" id="ef-${id}"><label for="ed-${id}">${label}</label><div class="ef-in ${editErrors[id] ? 'bad' : ''}">${I(P[icon], '#A9BCC4', 18, 2.2)}${input}</div><p class="ef-err">${editErrors[id] || ''}</p></div>`;
    return `${rays()}<div class="scroll">${status()}
  <div class="topbar">${balance()}<div class="iconbtn" onclick="PS.openProfile()" aria-label="Back">${I('<path d="m15 18-6-6 6-6"/>', '#F6D58A', 24, 2.6)}</div></div>
  <div class="wtitle"><div class="woodsign"><b>EDIT PROFILE</b></div></div>
  <div class="ed-av" onclick="PS.openPicker()"><div class="ring"><div class="inner">${animal(STATE.animal)}</div></div><span>Change avatar</span></div>
  <div class="card ed-card">
    ${field('name', 'Captain name', 'at', `<input id="ed-name" maxlength="16" value="${escA(d.name)}" autocomplete="nickname">`)}
    ${field('email', 'Email', 'mail', `<input id="ed-email" type="email" value="${escA(d.email)}" autocomplete="email">`)}
    ${field('phone', 'Phone', 'phone', `<input id="ed-phone" type="tel" value="${escA(d.phone)}" autocomplete="tel" placeholder="+972 50-000-0000">`)}
    ${field('birthday', 'Birthday', 'cake', `<input id="ed-birthday" type="date" value="${escA(d.birthday)}">`)}
    <div class="ef" id="ef-country"><label>Country</label><div class="ed-chips">${COUNTRIES.map((c) => `<button type="button" class="ed-chip ${d.country === c ? 'on' : ''}" onclick="PS.editSet('country','${c}')">${c}</button>`).join('')}</div></div>
    <div class="ef" id="ef-team"><label>Favorite team</label><div class="ed-teams">${FAV_TEAM_KEYS.map((k) => `<button type="button" class="ed-team ${d.team === k ? 'on' : ''}" onclick="PS.editSet('team','${k}')"><i style="background:${TEAMS[k][1]};color:${TEAMS[k][2]}">${k}</i><span>${escA(TEAMS[k][0])}</span></button>`).join('')}</div></div>
  </div>
  <div class="bigbtn" style="margin:18px 16px 0" onclick="PS.saveEdit()">${I(P.check, '#2B1A04', 22, 3.2)} SAVE CHANGES</div>
  </div>`;
  }
  const readEditInputs = () => {
    ['name', 'email', 'phone', 'birthday'].forEach((k) => { const el = document.getElementById(`ed-${k}`); if (el) editDraft[k] = el.value.trim(); });
  };

  /* ============ SETTINGS ============ */
  function settingsHTML() {
    const st = STATE.settings;
    const tog = (k, label, sub, icon) => `<label class="srow"><span class="di">${I(P[icon], '#F6D58A', 17, 2.2)}</span><span class="grow"><b>${label}</b><small>${sub}</small></span><input type="checkbox" class="sw" ${st[k] ? 'checked' : ''} onchange="PS.setSetting('${k}', this.checked)"></label>`;
    const link = (label, sub, icon, fn, cls = '') => `<div class="srow ${cls}" onclick="${fn}"><span class="di">${I(P[icon], cls ? '#FF8A8E' : '#F6D58A', 17, 2.2)}</span><span class="grow"><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</span><span class="chev">›</span></div>`;
    return `${rays()}<div class="scroll">${status()}
  <div class="topbar">${balance()}<div class="iconbtn" onclick="PS.openProfile()" aria-label="Back">${I('<path d="m15 18-6-6 6-6"/>', '#F6D58A', 24, 2.6)}</div></div>
  <div class="wtitle"><div class="woodsign"><b>SETTINGS</b></div></div>
  <div class="sec"><h2>GAME</h2></div>
  <div class="card details">
    ${tog('alerts', 'Live question alerts', 'Banner when a question opens during your match', 'bell')}
    ${tog('vibration', 'Vibration', 'Buzz on new questions and answers', 'phone')}
    ${tog('sound', 'Sound effects', 'Goals, coins and the Lucky Wheel', 'volume')}
    ${tog('reminders', 'Match reminders', 'Before your lobby kicks off', 'clock')}
  </div>
  <div class="sec"><h2>LANGUAGE</h2></div>
  <div class="card details lang">
    <div class="ed-chips">${[['en', 'English'], ['he', 'עברית']].map(([k, l]) => `<button type="button" class="ed-chip ${st.lang === k ? 'on' : ''}" onclick="PS.setSetting('lang','${k}')">${l}</button>`).join('')}</div>
    ${st.lang === 'he' ? '<p class="s-note">The Hebrew version is on the way. For now the app stays in English.</p>' : ''}
  </div>
  <div class="sec"><h2>ACCOUNT</h2></div>
  <div class="card details">
    ${link('Edit profile', 'Name, email, phone, team, birthday', 'pencil', 'PS.openEdit()')}
    ${tog('online', 'Show me as online', 'Friends see when you are around', 'globe')}
    ${link('Log out', '', 'logout', 'AUTH.logout()', 'danger')}
  </div>
  <p class="s-ver">Sharko Match Party · v1.0 demo</p>
  </div>`;
  }

  /* ============ ADD FRIENDS: share, contacts, QR, suggested ============ */
  const plateSheet = (plate, body, cls = '') => `<div class="dim" onclick="PS.closeSheet()"></div><div class="sheet ${cls}"><div class="plate">${plate}</div><div class="close" onclick="PS.closeSheet()">${I(P.x, '#fff', 16, 3.2)}</div>${body}</div>`;
  const back = `<div class="sh-back" onclick="PS.openAdd()">‹ Back to Add friends</div>`;
  function copyText(text, okMsg) {
    const fallback = () => {
      const el = document.getElementById('share-link'); if (el) { const r = document.createRange(); r.selectNodeContents(el); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
      toast('Select the link and copy it');
    };
    try { navigator.clipboard.writeText(text).then(() => toast(okMsg), fallback); } catch (e) { fallback(); }
  }
  function shareHTML() {
    return plateSheet('SHARE LINK', `${back}
      <p class="sh-p">Send this link to a friend. When they open it, you become friends on Sharko.</p>
      <div class="share-box"><span id="share-link">${inviteLink()}</span></div>
      <div class="bigbtn" onclick="PS.copyLink()">${I('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>', '#2B1A04', 20, 2.6)} COPY LINK</div>
      <div class="share-msg"><small>OR COPY A READY MESSAGE</small><p id="share-text">Join my crew on Sharko! 🦈 Let's play the next big match together: ${inviteLink()}</p><button class="copy btn-gold" onclick="PS.copyMessage()">COPY MESSAGE</button></div>`, 'tallsheet');
  }
  // Demo address book. A real phone app would ask for permission and read your contacts.
  const CONTACTS = [['Avi Mizrahi', '+972 52-311-4410', 'crab'], ['Dana Levi', '+972 54-220-9183', 'octopus'], ['Itay Cohen', '+972 50-781-2205', null], ['Michal Ben-Ami', '+972 58-640-1172', 'turtle'], ['Ron Shapira', '+972 53-907-3388', null], ['Tal Ohana', '+972 52-115-6609', 'puffer'], ['Yossi Azoulay', '+972 54-488-0027', null]];
  const invitedContacts = new Set();
  function contactsHTML() {
    const onApp = CONTACTS.filter((c) => c[2]); const notOn = CONTACTS.filter((c) => !c[2]);
    return plateSheet('CONTACTS', `${back}
      <p class="sh-p">Demo contacts. On a phone, Sharko asks for permission and shows who from your contacts already plays.</p>
      <div class="sh-scroll"><div class="subh"><b>ON SHARKO · ${onApp.length}</b></div>
      <div class="sug">${onApp.map(([n, ph, a]) => personRow([a, n, ph, 'In your contacts'])).join('')}</div>
      <div class="subh"><b>INVITE TO SHARKO · ${notOn.length}</b></div>
      <div class="sug">${notOn.map(([n, ph]) => `<div class="person"><div class="pa ini">${n.split(' ').map((x) => x[0]).join('')}</div><div class="grow"><div class="n">${escA(n)}</div><div class="h">${escA(ph)}</div></div><div class="addbtn ${invitedContacts.has(n) ? 'sent' : 'inv'}" onclick="PS.inviteContact(this,'${escA(n)}')">${invitedContacts.has(n) ? '✓ INVITED' : 'INVITE'}</div></div>`).join('')}</div></div>`, 'tallsheet');
  }
  function qrHTML() {
    return plateSheet('MY QR CODE', `${back}
      <div class="qr-card"><div class="qr" id="qr-box"></div><div class="qr-who"><span class="qr-av">${animal(STATE.animal)}</span><div><b>${escA(userName())}</b><small>@${escA(handle())}</small></div></div></div>
      <p class="sh-p" style="text-align:center">Friends scan this code with their phone camera to add you.</p>
      <div class="code" style="margin-top:6px"><div><div class="k">Your friend code</div><div class="v">${FRIEND_CODE}</div></div><div class="copy btn-gold" onclick="PS.copyCode()">COPY</div></div>`);
  }
  function drawQR() {
    const box = document.getElementById('qr-box'); if (!box) return;
    if (typeof qrcode !== 'function') { box.innerHTML = `<p class="sh-p">${FRIEND_CODE}</p>`; return; }
    const qr = qrcode(0, 'M'); qr.addData(inviteLink()); qr.make();
    box.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
  }
  let sugQuery = '';
  function suggestedHTML() {
    return plateSheet('SUGGESTED FRIENDS', `${back}
      <div class="search" style="margin-top:4px">${I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', '#A9BCC4', 20, 2.4)}<input id="sug-search" placeholder="Search suggestions" value="${escA(sugQuery)}" oninput="PS.filterSuggested(this.value)"></div>
      <div class="sug sh-scroll" id="sug-list">${SUGGESTED.map(personRow).join('')}</div>`, 'tallsheet');
  }

  /* ============ RENDER + INTERACTIONS ============ */
  const screen = () => document.getElementById('screen-profile');
  let view = 'profile';
  const render = (keepScroll) => {
    const sc = screen().querySelector('.scroll');
    const top = keepScroll && sc ? sc.scrollTop : 0;
    screen().innerHTML = view === 'wardrobe' ? wardrobeHTML() : view === 'friends' ? friendsHTML() : view === 'achievements' ? achievementsHTML() : view === 'edit' ? editHTML() : view === 'settings' ? settingsHTML() : profileHTML();
    screen().querySelector('.scroll').scrollTop = top;
  };
  const openSheet = (html) => { PS.closeSheet(); screen().insertAdjacentHTML('beforeend', html); };

  window.PS = {
    toast,
    openProfile() { view = 'profile'; render(); },
    animal: (k) => animal(k),
    animalInfo: (k) => ANIMALS[k],
    setAnimal(k) { STATE.animal = k; save(); render(); },
    openWardrobe() { view = 'wardrobe'; render(); },
    openFriends() { view = 'friends'; render(); },
    openAchievements() { view = 'achievements'; render(); },
    toggleSeason() { season = !season; render(true); },
    claim(id) {
      const x = STATS.achievements(achCtx()).find((a) => a.id === id);
      if (!x || !x.done || x.claimed) return;
      STATS.claim(id); APP.addCoins(x.reward);
      toast(`+${x.reward} coins for ${x.name}!`);
    },
    // Called when you open the Profile tab so stats are always current.
    refresh() { if (!screen().querySelector('.sheet')) render(true); },
    openFriend(i) { openSheet(friendSheet(i)); },
    friendTab(t) { friendTab = t; render(true); },
    filterFriends(q) { friendQuery = q; document.getElementById('fl-list').innerHTML = friendRows(); },
    inviteFriend(i) { PS.closeSheet(); toast(`Party invite sent to ${FRIENDS[i].name}`); },
    // Shared with the Market
    item: (k) => item(k),
    itemInfo: (k) => ({ ...ITEMS[k], rarity: RARITY[ITEMS[k].r] }),
    marketItems: () => Object.keys(ITEMS),
    friends: () => FRIENDS.map((f) => ({ name: f.name, animal: f.animal, online: f.online, level: f.level })),
    owns: (k) => STATE.owned.includes(k),
    wearing: (k, hat, eyes, extra) => wearing(k, hat, eyes, extra),
    look: () => ({ animal: STATE.animal, hat: STATE.hat, eyes: STATE.eyes, extra: STATE.extra }),
    pedestal: (w) => pedestal(w),
    grant(k) {
      if (!STATE.owned.includes(k)) { STATE.owned.push(k); setTimeout(checkAchievements, 50); }
      STATE[ITEMS[k].slot] = k; save(); render(true);
    },
    openPicker() { openSheet(pickerHTML(STATE.animal)); },
    openAdd() { openSheet(addHTML()); },
    openShare() { openSheet(shareHTML()); },
    copyLink() { copyText(inviteLink(), 'Invite link copied'); },
    copyMessage() { copyText(document.getElementById('share-text').textContent, 'Invite message copied'); },
    openContacts() { openSheet(contactsHTML()); },
    inviteContact(el, n) { invitedContacts.add(n); el.classList.remove('inv'); el.classList.add('sent'); el.textContent = '✓ INVITED'; copyText(`Join my crew on Sharko! 🦈 ${inviteLink()}`, `Invite for ${n} copied. Paste it in a message.`); },
    openQR() { openSheet(qrHTML()); drawQR(); },
    openSuggested() { sugQuery = ''; openSheet(suggestedHTML()); },
    filterSuggested(q) {
      sugQuery = q; const v = q.trim().toLowerCase();
      document.querySelectorAll('#sug-list .person').forEach((el) => { el.style.display = !v || el.dataset.q.includes(v) ? '' : 'none'; });
    },
    openEdit(focus) {
      editDraft = { name: userName(), ...STATE.details }; editFocus = focus || null; editErrors = {};
      view = 'edit'; render();
      if (editFocus) setTimeout(() => { const el = document.getElementById(`ef-${editFocus}`); if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); const inp = el.querySelector('input'); if (inp) inp.focus(); } }, 60);
    },
    editSet(k, v) { readEditInputs(); editDraft[k] = v; render(true); },
    saveEdit() {
      readEditInputs(); const d = editDraft; editErrors = {};
      if (!d.name || d.name.length < 3) editErrors.name = 'Use at least 3 characters.';
      else if (!/^[\w.\- ]+$/.test(d.name)) editErrors.name = 'Use letters, numbers, dots or dashes.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) editErrors.email = 'Enter a valid email, like you@example.com.';
      if (d.phone && !/^[+\d][\d\s-]{6,}$/.test(d.phone)) editErrors.phone = 'Use digits, spaces and dashes, like +972 50-123-4567.';
      if (d.birthday && (Date.now() - new Date(d.birthday)) / (365.25 * 864e5) < 18) editErrors.birthday = 'You need to be 18 or older.';
      if (Object.keys(editErrors).length) { render(true); return; }
      STATE.details = { email: d.email, phone: d.phone, country: d.country, team: d.team, birthday: d.birthday };
      save();
      if (d.name !== userName()) APP.setUser(d.name);
      view = 'profile'; render();
      toast('Profile saved');
    },
    openSettings() { view = 'settings'; render(); },
    setSetting(k, v) { STATE.settings[k] = v; save(); if (k === 'lang') render(true); toast(k === 'lang' ? (v === 'he' ? 'עברית נבחרה. The Hebrew version is coming soon.' : 'English selected') : 'Saved'); },
    setting: (k) => STATE.settings[k] !== false,
    closeSheet() { screen().querySelectorAll('.dim,.sheet').forEach((n) => n.remove()); },
    choose(k) { openSheet(pickerHTML(k)); },
    saveAnimal(k) { STATE.animal = k; save(); PS.closeSheet(); render(true); toast(`${ANIMALS[k].name} the ${ANIMALS[k].kind} is your new avatar`); },
    sendReq(el, n) { sentReq.add(n); el.classList.add('sent'); el.innerHTML = '✓ SENT'; toast(`Friend request sent to ${n}`); },
    searchPeople(q) {
      q = q.trim().toLowerCase();
      screen().querySelectorAll('.person').forEach((el) => { el.style.display = !q || el.dataset.q.includes(q) ? '' : 'none'; });
    },
    copyCode() {
      const done = () => toast('Friend code OR-4827 copied');
      try { navigator.clipboard.writeText('OR-4827').then(done, () => toast('Your friend code: OR-4827')); } catch (e) { toast('Your friend code: OR-4827'); }
    },
    tab(t) { wardTab = t; render(true); },
    equip(k) {
      const slot = ITEMS[k].slot;
      STATE[slot] = STATE[slot] === k ? null : k;
      render(true);
    },
    randomLook() {
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const of = (slot) => STATE.owned.filter((k) => ITEMS[k].slot === slot);
      STATE.hat = pick([...of('hat'), null]);
      STATE.eyes = pick([...of('eyes'), null]);
      STATE.extra = pick([...of('extra'), null]);
      render(true);
    },
    saveLook() { save(); toast('Look saved'); PS.openProfile(); },
  };

  // Stats change from lobbies, the wheel, the market and chat: keep the Profile current and announce new achievements.
  STATS.onChange(() => {
    checkAchievements();
    const scr = screen();
    if (scr.classList.contains('is-active') && !scr.querySelector('.sheet')) render(true);
  });

  render();
  checkAchievements();
})();
