// Market. Same look as the Profile/Wardrobe designs: wood sign, teal tabs, ink-outlined cards.
// Items are the Wardrobe items; buying one adds it to the Wardrobe and puts it on your avatar.
(() => {
  'use strict';

  const I = (p, c = '#9FB3BD', s = 24, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const P = {
    x: '<path d="M6 6l12 12M18 6 6 18"/>', hanger: '<path d="M12 7a2 2 0 1 1 2-2c0 1.2-2 1.8-2 3v1"/><path d="M12 9 3 16.5a1.5 1.5 0 0 0 1 2.5h16a1.5 1.5 0 0 0 1-2.5z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', check: '<path d="M5 12.5 10 17 19 7"/>',
  };
  const coinIc = (s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F2B84B" stroke="#1B1230" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#B8741F" stroke-width="1.6"/><path d="m12 8 1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="#FFF4C9"/></svg>`;
  const status = `<div class="status"><span>9:41</span><svg width="68" height="12" viewBox="0 0 68 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#fff"/><rect x="5" y="6" width="3" height="6" rx="1" fill="#fff"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#fff"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#fff"/><path d="M25 4.5a9 9 0 0 1 12 0M27.5 7a5.5 5.5 0 0 1 7 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="31" cy="10" r="1.4" fill="#fff"/><rect x="42.5" y=".5" width="22" height="11" rx="3" stroke="#fff" stroke-opacity=".5" fill="none"/><rect x="44.5" y="2.5" width="16" height="7" rx="1.6" fill="#fff"/></svg></div>`;
  const rays = `<div class="rays"><div class="glow"></div><i style="left:40px;width:60px;transform:rotate(18deg)"></i><i style="left:160px;width:40px;transform:rotate(12deg)"></i><i style="left:270px;width:70px;transform:rotate(8deg)"></i></div>`;
  const balance = () => `<div class="bal"><div class="coin"><svg width="16" height="16" viewBox="0 0 24 24"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" fill="#FFF4C9" stroke="#A86E17" stroke-width="1.6"/></svg></div><div><small>Balance</small><b data-bal-num>${APP.fmtBalance()}</b></div><div class="btn-gold topup" data-action="topup">+ Top up</div></div>`;
  const fmt = (n) => n.toLocaleString('en-US');
  const SLOT = { hat: 'HAT', eyes: 'EYES', extra: 'EXTRA' };

  // Treasure chests (coin packs). Demo: no payment is taken.
  const chest = (coins) => `<svg viewBox="0 0 84 84" width="100%" height="100%"><defs><linearGradient id="cb${coins}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B57443"/><stop offset="1" stop-color="#6E3D1D"/></linearGradient><linearGradient id="cl${coins}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98552"/><stop offset="1" stop-color="#8E5129"/></linearGradient></defs>
    ${coins >= 1200 ? '<circle cx="24" cy="30" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/><circle cx="60" cy="28" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/>' : ''}
    ${coins >= 2600 ? '<circle cx="42" cy="20" r="9" fill="#FFE59A" stroke="#1B1230" stroke-width="2.2"/><circle cx="34" cy="26" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/><circle cx="50" cy="26" r="8" fill="#F2B84B" stroke="#1B1230" stroke-width="2.2"/>' : ''}
    <path d="M10 44h64v24a7 7 0 0 1-7 7H17a7 7 0 0 1-7-7z" fill="url(#cb${coins})" stroke="#1B1230" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M10 44c0-12 14-18 32-18s32 6 32 18z" fill="url(#cl${coins})" stroke="#1B1230" stroke-width="2.6" stroke-linejoin="round"/>
    <rect x="8" y="41" width="68" height="8" rx="3" fill="#F2C14E" stroke="#1B1230" stroke-width="2.4"/>
    <path d="M24 49v24M60 49v24" stroke="#3A1D0B" stroke-width="2.4"/>
    <rect x="35" y="47" width="14" height="15" rx="3.5" fill="#F2C14E" stroke="#1B1230" stroke-width="2.4"/><circle cx="42" cy="54" r="2.2" fill="#1B1230"/>
    <path d="M18 34q8-5 18-6" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  const CHESTS = [
    { name: 'Small Chest', coins: 500, price: '$4.99', tag: '' },
    { name: 'Treasure Chest', coins: 1200, price: '$9.99', tag: '+20%' },
    { name: 'Mega Chest', coins: 2600, price: '$19.99', tag: 'BEST' },
  ];

  let tab = 'ALL';
  const forSale = () => PS.marketItems();
  const dealItem = () => {
    const pool = forSale().filter((k) => PS.itemInfo(k).price > 0);
    const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
    return pool[day % pool.length];
  };
  const dealPrice = (k) => Math.round(PS.itemInfo(k).price * 0.7 / 10) * 10;
  const priceOf = (k) => (k === dealItem() ? dealPrice(k) : PS.itemInfo(k).price);
  const untilMidnight = () => {
    const now = new Date(); const end = new Date(now); end.setHours(24, 0, 0, 0);
    let s = Math.floor((end - now) / 1000);
    const h = String(Math.floor(s / 3600)).padStart(2, '0'); s %= 3600;
    return `${h}:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  const tag = (k) => {
    const look = PS.look();
    if ([look.hat, look.eyes, look.extra].includes(k)) return '<div class="mk-price on">✓ WEARING</div>';
    if (PS.owns(k)) return '<div class="mk-price owned">OWNED</div>';
    return `<div class="mk-price">${coinIc(15)}${fmt(priceOf(k))}</div>`;
  };

  function html() {
    const d = dealItem(); const di = PS.itemInfo(d);
    const tabs = { ALL: () => true, HATS: (k) => PS.itemInfo(k).slot === 'hat', EYES: (k) => PS.itemInfo(k).slot === 'eyes', EXTRAS: (k) => PS.itemInfo(k).slot === 'extra' };
    // New items first, then the ones you already own.
    const list = forSale().filter(tabs[tab]).sort((a, b) => PS.owns(a) - PS.owns(b) || PS.itemInfo(b).price - PS.itemInfo(a).price);
    return `${rays}<div class="scroll">${status}
    <div class="topbar">${balance()}<div class="iconbtn" onclick="MK.wardrobe()" aria-label="Open Wardrobe">${I(P.hanger, '#F6D58A', 22, 2.2)}</div></div>
    <div class="wtitle"><div class="woodsign"><b>MARKET</b></div></div>

    <div class="deal" onclick="MK.open('${d}')">
      <div class="deal-ribbon">DAILY DEAL</div>
      <div class="deal-art"><div class="deal-ped">${PS.pedestal(150)}</div><div class="deal-item">${PS.item(d)}</div></div>
      <div class="deal-info">
        <span class="rar-chip" style="--rc:${di.r}">${di.rarity}</span>
        <h3>${di.n}</h3>
        <div class="deal-prices"><s>${fmt(di.price)}</s><b>${coinIc(18)}${fmt(dealPrice(d))}</b></div>
        <div class="deal-timer">${I(P.clock, '#A9BCC4', 13, 2.4)} Ends in <span id="mk-timer">${untilMidnight()}</span></div>
        ${PS.owns(d) ? '<div class="deal-btn owned">OWNED</div>' : '<div class="deal-btn">-30% · BUY</div>'}
      </div>
    </div>

    <div class="tabs">${['ALL', 'HATS', 'EYES', 'EXTRAS'].map((t) => `<div class="${t === tab ? 'on' : ''}" onclick="MK.tab('${t}')">${t}</div>`).join('')}</div>
    <div class="mk-grid">${list.map((k) => { const it = PS.itemInfo(k); return `<div class="mk-it ${PS.owns(k) ? 'is-owned' : ''}" onclick="MK.open('${k}')">
      <span class="rar" style="background:${it.r}"></span><span class="mk-slot">${SLOT[it.slot]}</span>
      <div class="art">${PS.item(k)}</div><div class="nm">${it.n}</div>${tag(k)}</div>`; }).join('')}</div>

    <div class="sec"><h2>TREASURE CHESTS</h2><span class="sec-note">Coins for parties &amp; gear</span></div>
    <div class="chests">${CHESTS.map((c, i) => `<div class="chest" onclick="MK.chest(${i})">${c.tag ? `<span class="chest-tag ${c.tag === 'BEST' ? 'best' : ''}">${c.tag}</span>` : ''}
      <div class="chest-art">${chest(c.coins)}</div><b>${coinIc(14)}${fmt(c.coins)}</b><small>${c.name}</small><div class="chest-btn">${c.price}</div></div>`).join('')}</div>
    <p class="mk-note">Demo store. Nothing is charged.</p>
    </div>`;
  }

  function buySheet(k) {
    const it = PS.itemInfo(k);
    const look = PS.look();
    const tryOn = { ...look, [it.slot]: k };
    const price = priceOf(k);
    const owned = PS.owns(k);
    const enough = APP.balance() >= price;
    return `<div class="dim" onclick="MK.close()"></div><div class="sheet">
      <div class="plate">${owned ? 'IN YOUR WARDROBE' : 'TRY IT ON'}</div>
      <div class="close" onclick="MK.close()">${I(P.x, '#fff', 16, 3.2)}</div>
      <div class="try">
        <div class="try-av"><div class="try-clip">${PS.animal(look.animal)}</div><div class="try-worn">${PS.wearing(look.animal, tryOn.hat, tryOn.eyes, tryOn.extra)}</div></div>
        <div class="try-info"><span class="rar-chip" style="--rc:${it.r}">${it.rarity}</span><h4>${it.n}</h4><p>${SLOT[it.slot]} item. ${owned ? 'You already own it.' : 'Goes straight into your Wardrobe and onto your avatar.'}</p>
          ${owned ? '' : `<div class="try-price">${coinIc(20)}<b>${fmt(price)}</b>${k === dealItem() ? `<s>${fmt(it.price)}</s>` : ''}</div>`}</div>
      </div>
      ${owned ? `<div class="bigbtn" onclick="MK.wear('${k}')">${I(P.hanger, '#2B1A04', 22, 2.6)} WEAR IT</div>`
        : enough ? `<div class="bigbtn" onclick="MK.buy('${k}')">${coinIc(22)} BUY FOR ${fmt(price)}</div>`
        : `<div class="bigbtn short" onclick="MK.close();APP.topUp()">NOT ENOUGH COINS · TOP UP</div><p class="short-note">You need ${fmt(price - APP.balance())} more coins.</p>`}
    </div>`;
  }

  const screen = () => document.getElementById('screen-market');
  const render = (keep) => {
    const sc = screen().querySelector('.scroll'); const top = keep && sc ? sc.scrollTop : 0;
    screen().innerHTML = html();
    screen().querySelector('.scroll').scrollTop = top;
  };

  window.MK = {
    render,
    tab(t) { tab = t; render(true); },
    open(k) { MK.close(); screen().insertAdjacentHTML('beforeend', buySheet(k)); },
    close() { screen().querySelectorAll('.dim,.sheet').forEach((n) => n.remove()); },
    buy(k) {
      const price = priceOf(k);
      if (!APP.spend(price)) { MK.open(k); return; }
      PS.grant(k);
      MK.close(); render(true);
      APP.toast(`${PS.itemInfo(k).n} is in your Wardrobe and on your avatar`);
    },
    wear(k) { PS.grant(k); MK.close(); render(true); APP.toast(`Wearing ${PS.itemInfo(k).n}`); },
    chest(i) { const c = CHESTS[i]; APP.addCoins(c.coins); APP.toast(`+${fmt(c.coins)} coins from the ${c.name} (demo, no charge)`); },
    wardrobe() { APP.go('profile'); PS.openWardrobe(); },
  };

  setInterval(() => { const t = document.getElementById('mk-timer'); if (t) t.textContent = untilMidnight(); }, 1000);
  render();
})();
