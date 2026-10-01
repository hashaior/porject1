// Loading screen -> Sign in -> (Create account). Demo only: nothing is sent anywhere.
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const I = (p, c = '#A9BCC4', s = 20, w = 2.2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const P = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    anchor: '<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21M5 12H3a9 9 0 0 0 18 0h-2M8 10h8"/>',
    cake: '<path d="M4 21V13a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><path d="M4 16c2 1 4 1 6 0s4-1 6 0 4 1 4 0"/><path d="M2 21h20M12 11V7M12 4.5v.01"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    swords: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4"/><path d="m7 17-3 3"/><path d="m3 19 2 2"/>',
    check: '<path d="M5 12.5 10 17 19 7"/>',
    chest: '<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M3 13h18M5 9a7 7 0 0 1 14 0"/><rect x="10" y="11.5" width="4" height="4" rx="1"/>',
  };
  const status = `<div class="auth-status"><span>9:41</span><svg width="68" height="12" viewBox="0 0 68 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#fff"/><rect x="5" y="6" width="3" height="6" rx="1" fill="#fff"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#fff"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#fff"/><path d="M25 4.5a9 9 0 0 1 12 0M27.5 7a5.5 5.5 0 0 1 7 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="31" cy="10" r="1.4" fill="#fff"/><rect x="42.5" y=".5" width="22" height="11" rx="3" stroke="#fff" stroke-opacity=".5" fill="none"/><rect x="44.5" y="2.5" width="16" height="7" rx="1.6" fill="#fff"/></svg></div>`;
  const logo = `<div class="logo"><h1>SHARKO</h1><span>MATCH PARTY</span></div>`;
  const BG = 'assets/img/loading-bg.jpg';

  const KEY = 'sharko.auth.v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { /* ignore */ }
  const store = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignore */ } };

  const phone = () => $('#phone');
  const show = (id, html) => {
    let el = document.getElementById(id);
    if (!el) { el = document.createElement('section'); el.id = id; el.className = 'auth'; phone().appendChild(el); }
    el.classList.remove('leaving');
    el.innerHTML = html;
    return el;
  };
  const hide = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 450);
  };
  const toast = (m) => window.APP && APP.toast(m);

  /* ---------- Loading ---------- */
  const TIPS = ['Waking up Sharko…', 'Polishing the crystals…', 'Loading tonight\'s matches…', 'Filling the treasure chest…', 'Ready!'];
  function loading() {
    const el = show('auth-loading', `<img class="auth-bg" src="${BG}" alt="">${status}${logo}
      <div class="load-wrap">
        <div class="load-row"><span class="load-tip" id="load-tip">${TIPS[0]}</span><span class="load-pct" id="load-pct">0%</span></div>
        <div class="load-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Loading"><i id="load-fill"></i></div>
        <div class="load-ver">v1.0.0 · DEMO BUILD</div>
      </div>`);
    const fast = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = fast ? 1200 : 5200;
    // Uneven speed so it feels like real loading: quick start, a pause, then a run to 100.
    const ease = (t) => (t < 0.45 ? t * 1.35 : t < 0.6 ? 0.6075 + (t - 0.45) * 0.4 : 0.6675 + (t - 0.6) * 0.83125);
    const start = performance.now();
    const fill = $('#load-fill', el); const pct = $('#load-pct', el); const tip = $('#load-tip', el); const bar = $('.load-bar', el);
    const step = (now) => {
      const t = Math.min(1, (now - start) / total);
      const v = Math.round(Math.min(1, ease(t)) * 100);
      fill.style.width = `${v}%`;
      pct.textContent = `${v}%`;
      bar.setAttribute('aria-valuenow', v);
      tip.textContent = TIPS[Math.min(TIPS.length - 1, Math.floor(v / 25))];
      if (t < 1) requestAnimationFrame(step);
      else setTimeout(() => { login(); hide('auth-loading'); }, 600);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Sign in ---------- */
  function login() {
    const shark = window.PS && PS.animal ? PS.animal(saved.animal || 'shark') : '';
    const bubbles = Array.from({ length: 12 }, (_, i) => {
      const size = 6 + ((i * 7) % 14);
      return `<b style="left:${(i * 37) % 100}%;width:${size}px;height:${size}px;animation-duration:${7 + (i % 5) * 1.6}s;animation-delay:-${(i * 1.3) % 9}s"></b>`;
    }).join('');
    const el = show('auth-login', `<div class="rays"><i style="left:40px;width:60px;transform:rotate(18deg)"></i><i style="left:160px;width:40px;transform:rotate(12deg)"></i><i style="left:270px;width:70px;transform:rotate(8deg)"></i></div>
      <div class="bubbles">${bubbles}</div>
      <div class="login-scroll">${status}
        <div class="login-hero">
          <div class="hero-ring"><div class="inner">${shark}</div><span class="gem" style="left:-5px;top:50px"></span><span class="gem" style="right:-5px;top:30px"></span></div>
          ${logo}
          <p class="tagline">Watch together. Win together.</p>
        </div>
        <form class="login-form" id="login-form" novalidate>
          <div class="plate">WELCOME BACK!</div>
          <div class="field"><label for="li-name">Captain name or email</label>
            <div class="input">${I(P.user)}<input id="li-name" autocomplete="username" placeholder="CaptainOr" value="${saved.remember && saved.name ? saved.name.replace(/"/g, '&quot;') : ''}"></div>
            <div class="err" id="li-name-err"></div></div>
          <div class="field"><label for="li-pass">Password</label>
            <div class="input">${I(P.lock)}<input id="li-pass" type="password" autocomplete="current-password" placeholder="••••••••"><button type="button" class="eye" data-eye="li-pass" aria-label="Show password">${I(P.eye)}</button></div>
            <div class="err" id="li-pass-err"></div></div>
          <div class="row-between">
            <label class="check"><input type="checkbox" id="li-remember" ${saved.remember !== false ? 'checked' : ''}>Remember me</label>
            <button type="button" class="link" id="li-forgot">Forgot password?</button>
          </div>
          <button class="bigbtn" type="submit" id="li-go">${I(P.anchor, '#2B1A04', 22, 2.8)} SET SAIL</button>
          <div class="divider">or</div>
          <div class="alt">
            <button type="button" class="altbtn teal" id="li-phone">${I(P.phone, '#fff', 18, 2.6)} PHONE</button>
            <button type="button" class="altbtn purple" id="li-guest">${I(P.swords, '#fff', 18, 2.6)} GUEST</button>
          </div>
        </form>
        <div class="switch-line">New to the crew? <button type="button" class="link" id="li-signup">Create account ›</button></div>
      </div>`);
    wireEyes(el);
    $('#li-forgot', el).onclick = () => toast('Reset link sent to your email (demo)');
    $('#li-phone', el).onclick = () => toast('Phone sign-in is not part of this demo');
    $('#li-guest', el).onclick = () => enter(APP.userName(), 'Sailing as a guest');
    $('#li-signup', el).onclick = () => signup();
    $('#login-form', el).onsubmit = (e) => {
      e.preventDefault();
      const name = $('#li-name', el).value.trim();
      const pass = $('#li-pass', el).value;
      const errs = {
        'li-name': !name ? 'Enter your captain name or email.' : '',
        'li-pass': !pass ? 'Enter your password.' : pass.length < 4 ? 'Password is at least 4 characters.' : '',
      };
      if (!showErrors(el, errs)) return;
      const remember = $('#li-remember', el).checked;
      const display = name.includes('@') ? name.split('@')[0] : name;
      store({ ...saved, name, remember });
      busy($('#li-go', el), 'BOARDING…', () => enter(display.slice(0, 16), `Welcome back, ${display.slice(0, 16)}!`));
    };
  }

  /* ---------- Sign up ---------- */
  const TEAMS = [['MTA', 'Maccabi TA', '#FFD84D', '#1B2B5A'], ['HBS', "H. Be'er Sheva", '#E24A4A', '#fff'], ['MHA', 'Maccabi Haifa', '#2FBF6A', '#fff'], ['LIV', 'Liverpool', '#E0414B', '#fff'], ['RMA', 'Real Madrid', '#FFFFFF', '#1B2B5A'], ['BAR', 'Barcelona', '#C23B6A', '#fff'], ['MCI', 'Man City', '#8FD3FF', '#fff']];
  const CREW = ['shark', 'octopus', 'turtle', 'crab', 'puffer'];
  function signup() {
    const su = { animal: 'shark', team: 'MTA' };
    const avatar = (k) => (window.PS && PS.animal ? PS.animal(k) : '');
    const kind = (k) => { const a = window.PS && PS.animalInfo ? PS.animalInfo(k) : null; return a ? (a.kind === 'Pufferfish' ? 'Puffer' : a.kind) : k; };
    const el = show('auth-signup', `<img class="auth-bg" src="${BG}" alt="">
      <div class="su-scroll">${status}
        <div class="su-top"><button type="button" class="iconbtn" id="su-back" aria-label="Back to sign in">${I(P.back, '#F6D58A', 24, 2.6)}</button></div>
        <div class="woodsign"><b>JOIN THE CREW</b></div>
        <div class="bonus"><div class="chest">${I(P.chest, '#FCE39A', 24, 2.2)}</div><div><b>WELCOME BONUS +500</b><small>Free coins when you create your account</small></div></div>

        <div class="su-sec">PICK YOUR CREW <small>You can change it later</small></div>
        <div class="crew-picks" id="su-crew"></div>

        <form id="su-form" novalidate>
          <div class="su-sec">YOUR DETAILS</div>
          <div class="su-card">
            <div class="field"><label for="su-name">Captain name</label>
              <div class="input">${I(P.user)}<input id="su-name" maxlength="16" autocomplete="nickname" placeholder="e.g. CaptainOr"></div><div class="err" id="su-name-err"></div></div>
            <div class="field"><label for="su-email">Email</label>
              <div class="input">${I(P.mail)}<input id="su-email" type="email" autocomplete="email" placeholder="you@example.com"></div><div class="err" id="su-email-err"></div></div>
            <div class="field"><label for="su-pass">Password</label>
              <div class="input">${I(P.lock)}<input id="su-pass" type="password" autocomplete="new-password" placeholder="At least 6 characters"><button type="button" class="eye" data-eye="su-pass" aria-label="Show password">${I(P.eye)}</button></div>
              <div class="strength" id="su-strength"><i></i><i></i><i></i><i></i><span></span></div><div class="err" id="su-pass-err"></div></div>
            <div class="field"><label for="su-bday">Birthday</label>
              <div class="input">${I(P.cake)}<input id="su-bday" type="date"></div><div class="err" id="su-bday-err"></div></div>
          </div>

          <div class="su-sec">FAVORITE TEAM</div>
          <div class="su-teams" id="su-teams"></div>

          <label class="check terms"><input type="checkbox" id="su-terms"><span>I am 18 or older and agree to the Terms and Privacy Policy</span></label>
          <div class="err" id="su-terms-err" style="margin:6px 20px 0"></div>
          <button class="bigbtn su-cta" type="submit" id="su-go">${I(P.check, '#2B1A04', 22, 3.2)} CREATE ACCOUNT</button>
          <div class="switch-line">Already in the crew? <button type="button" class="link" id="su-login">Sign in ›</button></div>
        </form>
      </div>`);
    const renderCrew = () => {
      $('#su-crew', el).innerHTML = CREW.map((k) => `<div class="cp ${k === su.animal ? 'sel' : ''}" data-k="${k}"><div class="pa">${avatar(k)}</div><span>${kind(k)}</span>${k === su.animal ? `<div class="tick">${I(P.check, '#fff', 12, 3.4)}</div>` : ''}</div>`).join('');
    };
    const renderTeams = () => {
      $('#su-teams', el).innerHTML = TEAMS.map(([k, n, c, t]) => `<button type="button" class="su-team ${k === su.team ? 'on' : ''}" data-k="${k}"><i style="background:${c};color:${t}">${k}</i>${n}</button>`).join('');
    };
    renderCrew(); renderTeams(); wireEyes(el);
    $('#su-crew', el).onclick = (e) => { const c = e.target.closest('.cp'); if (c) { su.animal = c.dataset.k; renderCrew(); } };
    $('#su-teams', el).onclick = (e) => { const c = e.target.closest('.su-team'); if (c) { su.team = c.dataset.k; renderTeams(); } };
    $('#su-back', el).onclick = () => hide('auth-signup');
    $('#su-login', el).onclick = () => hide('auth-signup');
    $('#su-pass', el).oninput = (e) => strength(el, e.target.value);
    $('#su-form', el).onsubmit = (e) => {
      e.preventDefault();
      const name = $('#su-name', el).value.trim();
      const email = $('#su-email', el).value.trim();
      const pass = $('#su-pass', el).value;
      const bday = $('#su-bday', el).value;
      const age = bday ? (Date.now() - new Date(bday)) / (365.25 * 864e5) : 0;
      const errs = {
        'su-name': !name ? 'Pick a captain name.' : name.length < 3 ? 'Use at least 3 characters.' : !/^[\w.\- ]+$/.test(name) ? 'Use letters, numbers, dots or dashes.' : '',
        'su-email': !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email, like you@example.com.' : '',
        'su-pass': pass.length < 6 ? 'Password needs at least 6 characters.' : '',
        'su-bday': !bday ? 'Enter your birthday.' : age < 18 ? 'You need to be 18 or older to join.' : '',
        'su-terms': !$('#su-terms', el).checked ? 'Accept the terms to continue.' : '',
      };
      if (!showErrors(el, errs)) return;
      store({ name, remember: true });
      busy($('#su-go', el), 'CREATING…', () => {
        if (window.PS && PS.setAnimal) PS.setAnimal(su.animal);
        store({ name, remember: true, animal: su.animal });
        APP.addCoins(500);
        hide('auth-signup');
        enter(name, `Welcome aboard, ${name}! +500 coins`);
      });
    };
  }

  /* ---------- helpers ---------- */
  function wireEyes(el) {
    el.querySelectorAll('[data-eye]').forEach((b) => {
      b.onclick = () => {
        const inp = document.getElementById(b.dataset.eye);
        const showIt = inp.type === 'password';
        inp.type = showIt ? 'text' : 'password';
        b.innerHTML = I(showIt ? P.eyeOff : P.eye);
        b.setAttribute('aria-label', showIt ? 'Hide password' : 'Show password');
      };
    });
  }
  function showErrors(el, errs) {
    let first = null;
    Object.entries(errs).forEach(([id, msg]) => {
      const e = $(`#${id}-err`, el); if (e) e.textContent = msg;
      const box = $(`#${id}`, el).closest('.input'); if (box) box.classList.toggle('bad', !!msg);
      if (msg && !first) first = id;
    });
    if (first) { const f = $(`#${first}`, el); f.focus(); f.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    return !first;
  }
  function strength(el, v) {
    let s = 0;
    if (v.length >= 6) s++;
    if (v.length >= 10) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v) && /[^\w]/.test(v)) s++;
    const colors = ['#E5484D', '#FF9A3C', '#F2C14E', '#4ADE80'];
    const labels = ['Weak', 'Okay', 'Good', 'Strong'];
    const bars = el.querySelectorAll('#su-strength i');
    bars.forEach((b, i) => { b.style.background = v && i < Math.max(1, s) ? colors[Math.max(0, s - 1)] : ''; });
    $('#su-strength span', el).textContent = v ? labels[Math.max(0, s - 1)] : '';
  }
  function busy(btn, label, done) {
    btn.classList.add('busy');
    btn.textContent = label;
    setTimeout(done, 700);
  }
  function enter(name, msg) {
    APP.setUser(name);
    APP.go('home');
    hide('auth-login');
    setTimeout(() => toast(msg), 300);
  }

  window.AUTH = {
    logout() {
      login();
      setTimeout(() => toast('You signed out'), 400);
    },
  };

  loading();
})();
