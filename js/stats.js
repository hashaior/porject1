// Player stats and achievements. Stats start from the demo numbers in the Profile design and
// grow with what you do in the app. Saved in this browser.
(() => {
  'use strict';

  const KEY = 'sharko.stats.v1';
  // Season numbers match the Profile design (48 matches, 31 wins, 12 lobbies).
  const BASE = { matches: 48, wins: 31, hosted: 12, bestStreak: 5, spins: 0, wheelBest: 0, invites: 0, chats: 0, fullHouse: 0, highRoller: 0, coinsSpent: 0, joinedByCode: 0 };
  // Earlier seasons, added on top for "All time".
  const PAST = { matches: 132, wins: 71, hosted: 29 };

  let S = { ...BASE, claimed: ['first_win', 'party_host', 'streak5'], seen: ['first_win', 'party_host', 'streak5'] };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* defaults */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  const listeners = [];
  const changed = () => { save(); listeners.forEach((fn) => fn()); };

  // value(s, ctx) -> current progress; ctx.owned = number of wardrobe items you own
  const ACHIEVEMENTS = [
    { id: 'first_win', name: 'First Win', icon: 'trophy', c: ['#F2B84B', '#B8741F'], desc: 'Win your first party', target: 1, value: (s) => s.wins, reward: 100 },
    { id: 'party_host', name: 'Party Host', icon: 'flag', c: ['#B98CFF', '#6A3FB5'], desc: 'Host a lobby', target: 1, value: (s) => s.hosted, reward: 100 },
    { id: 'streak5', name: '5 Win Streak', icon: 'target', c: ['#FF8A5B', '#C9303A'], desc: 'Win 5 parties in a row', target: 5, value: (s) => s.bestStreak, reward: 250 },
    { id: 'collector', name: 'Collector', icon: 'bag', c: ['#7FD8FF', '#2A6FC9'], desc: 'Own 10 wardrobe items', target: 10, value: (s, ctx) => ctx.owned, reward: 250 },
    { id: 'lucky', name: 'Lucky Spin', icon: 'wheel', c: ['#8AD6CB', '#3F8C85'], desc: 'Spin the Lucky Wheel', target: 1, value: (s) => s.spins, reward: 50 },
    { id: 'jackpot', name: 'Jackpot!', icon: 'coin', c: ['#FCE39A', '#DB952F'], desc: 'Hit 500 on the Lucky Wheel', target: 500, value: (s) => s.wheelBest, reward: 300 },
    { id: 'crew', name: 'Crew Builder', icon: 'userplus', c: ['#8BEB6E', '#2FA84A'], desc: 'Invite 10 friends to lobbies', target: 10, value: (s) => s.invites, reward: 150 },
    { id: 'chatter', name: 'Chatterbox', icon: 'chat', c: ['#4DA3FF', '#16275E'], desc: 'Send 20 lobby chat messages', target: 20, value: (s) => s.chats, reward: 100 },
    { id: 'full_house', name: 'Full House', icon: 'crown', c: ['#FFA8CC', '#B83468'], desc: 'Fill a lobby with 6 players', target: 1, value: (s) => s.fullHouse, reward: 200 },
    { id: 'high_roller', name: 'High Roller', icon: 'gem', c: ['#C9A2FF', '#5B2E9E'], desc: 'Play a lobby with a 1,000 entry', target: 1, value: (s) => s.highRoller, reward: 200 },
    { id: 'spender', name: 'Big Spender', icon: 'cart', c: ['#FFE27A', '#C98522'], desc: 'Spend 2,000 coins in the Market', target: 2000, value: (s) => s.coinsSpent, reward: 150 },
    { id: 'veteran', name: 'Veteran', icon: 'ball', c: ['#A9C3CC', '#4F6873'], desc: 'Play 60 matches this season', target: 60, value: (s) => s.matches, reward: 300 },
  ];

  window.STATS = {
    get: () => S,
    view(season) {
      if (season) return { ...S };
      return { ...S, matches: S.matches + PAST.matches, wins: S.wins + PAST.wins, hosted: S.hosted + PAST.hosted };
    },
    add(key, n = 1) { S[key] = (S[key] || 0) + n; changed(); },
    max(key, v) { if (v > (S[key] || 0)) { S[key] = v; changed(); } },
    onChange(fn) { listeners.push(fn); },
    achievements(ctx) {
      return ACHIEVEMENTS.map((a) => {
        const v = Math.min(a.target, a.value(S, ctx));
        return { ...a, progress: v, done: v >= a.target, claimed: S.claimed.includes(a.id) };
      });
    },
    claim(id) { if (!S.claimed.includes(id)) { S.claimed.push(id); changed(); } },
    // Returns achievements that became complete since the last call (for the "unlocked" toast).
    newlyDone(ctx) {
      const fresh = STATS.achievements(ctx).filter((a) => a.done && !S.seen.includes(a.id));
      if (fresh.length) { fresh.forEach((a) => S.seen.push(a.id)); save(); }
      return fresh;
    },
  };
})();
