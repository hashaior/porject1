// Demo data only. None of these numbers are real.

const LEAGUES = {
  epl: { name: 'Premier League', country: 'England', color: '#9b7bff' },
  laliga: { name: 'La Liga', country: 'Spain', color: '#ff7a3d' },
  ligat: { name: "Ligat Ha'Al", country: 'Israel', color: '#35d07f' },
  seriea: { name: 'Serie A', country: 'Italy', color: '#3d9bff' },
  bundes: { name: 'Bundesliga', country: 'Germany', color: '#ff4d5a' },
  ucl: { name: 'Champions League', country: 'Europe', color: '#4fd6e8' },
};

// abbr, name, color, text color, stadium
const TEAMS = {
  LIV: ['Liverpool', '#c8102e', '#fff', 'Anfield, Liverpool'],
  MCI: ['Man City', '#7ec3ee', '#fff', 'Etihad Stadium, Manchester'],
  ARS: ['Arsenal', '#ef0107', '#fff', 'Emirates Stadium, London'],
  CHE: ['Chelsea', '#034694', '#fff', 'Stamford Bridge, London'],
  MUN: ['Man United', '#da291c', '#fff', 'Old Trafford, Manchester'],
  TOT: ['Tottenham', '#f4f4f4', '#132257', 'Tottenham Hotspur Stadium, London'],
  NEW: ['Newcastle', '#2b2b2b', '#fff', "St James' Park, Newcastle"],
  AVL: ['Aston Villa', '#670e36', '#fff', 'Villa Park, Birmingham'],
  WHU: ['West Ham', '#7a263a', '#fff', 'London Stadium, London'],
  EVE: ['Everton', '#003399', '#fff', 'Goodison Park, Liverpool'],
  BHA: ['Brighton', '#0057b8', '#fff', 'Amex Stadium, Brighton'],
  CRY: ['Crystal Palace', '#1b458f', '#fff', 'Selhurst Park, London'],
  RMA: ['Real Madrid', '#f4f4f4', '#22336b', 'Santiago Bernabéu, Madrid'],
  BAR: ['Barcelona', '#8a2a6e', '#fff', 'Spotify Camp Nou, Barcelona'],
  ATM: ['Atlético', '#cb3524', '#fff', 'Metropolitano, Madrid'],
  SEV: ['Sevilla', '#f4f4f4', '#d81920', 'Sánchez-Pizjuán, Seville'],
  RSO: ['Real Sociedad', '#0067b1', '#fff', 'Anoeta, San Sebastián'],
  VIL: ['Villarreal', '#ffe667', '#5a4a00', 'La Cerámica, Villarreal'],
  MTA: ['Maccabi TA', '#f5c400', '#1a2a6c', 'Bloomfield, Tel Aviv'],
  HBS: ["H. Be'er Sheva", '#d71920', '#fff', "Turner Stadium, Be'er Sheva"],
  MHA: ['Maccabi Haifa', '#00a650', '#fff', 'Sammy Ofer, Haifa'],
  HTA: ['Hapoel TA', '#e30613', '#fff', 'Bloomfield, Tel Aviv'],
  BEI: ['Beitar', '#f5d000', '#111', 'Teddy Stadium, Jerusalem'],
  HHA: ['Hapoel Haifa', '#c4161c', '#fff', 'Sammy Ofer, Haifa'],
  INT: ['Inter', '#0068a8', '#fff', 'San Siro, Milan'],
  MIL: ['Milan', '#fb090b', '#fff', 'San Siro, Milan'],
  JUV: ['Juventus', '#1b1b1b', '#fff', 'Allianz Stadium, Turin'],
  NAP: ['Napoli', '#12a0d7', '#fff', 'Diego Maradona, Naples'],
  ROM: ['Roma', '#8e1f2f', '#f5b400', 'Stadio Olimpico, Rome'],
  FCB: ['Bayern', '#dc052d', '#fff', 'Allianz Arena, Munich'],
  BVB: ['Dortmund', '#fde100', '#111', 'Signal Iduna Park, Dortmund'],
  B04: ['Leverkusen', '#e32221', '#111', 'BayArena, Leverkusen'],
  RBL: ['Leipzig', '#f4f4f4', '#dd0741', 'Red Bull Arena, Leipzig'],
};

// The first three cards are exactly the ones in the design.
// 'sat' / 'sun' mean the coming Saturday / Sunday.
const FEATURED = [
  ['epl', 'LIV', 'MCI', 0, '21:00'],
  ['laliga', 'RMA', 'BAR', 'sat', '22:00'],
  ['ligat', 'MTA', 'HBS', 'sun', '20:30'],
];

// The rest is generated so the totals match the design:
// 128 matches in total, and 24 Premier League matches this week.
const POOLS = {
  epl: ['ARS', 'CHE', 'MUN', 'TOT', 'NEW', 'AVL', 'WHU', 'EVE', 'BHA', 'CRY', 'LIV', 'MCI'],
  laliga: ['ATM', 'SEV', 'RSO', 'VIL', 'RMA', 'BAR'],
  ligat: ['MHA', 'HTA', 'BEI', 'HHA', 'MTA', 'HBS'],
  seriea: ['INT', 'MIL', 'JUV', 'NAP', 'ROM'],
  bundes: ['FCB', 'BVB', 'B04', 'RBL'],
  ucl: ['RMA', 'MCI', 'INT', 'FCB', 'BAR', 'LIV', 'ARS', 'JUV'],
};
// [league, list of day offsets (one entry per match)]
const SCHEDULE = [
  ['epl', [0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 9, 9, 9, 11, 11, 11, 13, 13, 13]],
  ['laliga', [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 12, 13]],
  ['ligat', [0, 1, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 8, 9, 10, 11, 12, 12, 13]],
  ['seriea', [0, 1, 2, 2, 3, 4, 4, 5, 6, 7, 7, 8, 9, 9, 10, 11, 11, 12, 13, 13]],
  ['bundes', [1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 8, 9, 10, 11, 12, 12, 13, 13]],
  ['ucl', [1, 1, 2, 2, 8, 8, 9, 9, 13, 13, 13, 13]],
];
const KICKOFFS = ['16:30', '17:00', '18:30', '19:00', '19:45', '20:00', '20:30', '21:00', '21:45', '22:00'];

const FIXTURES = (() => {
  const out = FEATURED.slice();
  SCHEDULE.forEach(([league, days], li) => {
    const pool = POOLS[league];
    days.forEach((day, i) => {
      const home = pool[i % pool.length];
      let away = pool[(i + 1 + Math.floor(i / pool.length)) % pool.length];
      if (away === home) away = pool[(i + 2) % pool.length];
      out.push([league, home, away, day, KICKOFFS[(i * 3 + li) % KICKOFFS.length]]);
    });
  });
  return out;
})();

// Finished parties. [league, home, away, days ago, home score, away score, your pick, players, coins +/-]
const RESULTS = [
  ['ligat', 'MHA', 'MTA', 1, 2, 1, 'MHA', 6, 450],
  ['epl', 'ARS', 'LIV', 2, 1, 1, 'LIV', 8, -200],
  ['laliga', 'BAR', 'SEV', 3, 3, 0, 'BAR', 5, 620],
  ['seriea', 'NAP', 'ROM', 4, 0, 2, 'NAP', 4, -150],
  ['ucl', 'RMA', 'INT', 6, 2, 2, 'DRAW', 10, 900],
  ['bundes', 'BVB', 'FCB', 7, 1, 3, 'FCB', 6, 310],
  ['epl', 'MCI', 'CHE', 9, 4, 1, 'MCI', 7, 280],
  ['ligat', 'HBS', 'HTA', 11, 0, 1, 'HBS', 5, -250],
];

const DEALS = [
  { id: 'helmet', name: 'Aviator Cap', img: 'assets/img/item-helmet.jpg', price: '$4.99 USD' },
  { id: 'monocle', name: 'Golden Monocle', img: 'assets/img/item-monocle.jpg', price: '$4.99 USD' },
  { id: 'beanie', name: 'Deckhand Beanie', img: 'assets/img/item-beanie.jpg', price: '$4.99 USD' },
  { id: 'goggles', name: 'Neon Goggles', img: 'assets/img/item-goggles.jpg', price: '$4.99 USD' },
  { id: 'wizard', name: 'Sea Wizard Hat', img: 'assets/img/item-wizard.jpg', price: '$4.99 USD' },
  { id: 'sunglasses', name: 'Cat-Eye Shades', img: 'assets/img/item-sunglasses.jpg', price: '$4.99 USD' },
];

const COIN_PACKS = [
  { coins: 500, price: '$4.99', tag: '' },
  { coins: 1200, price: '$9.99', tag: '+20%' },
  { coins: 2600, price: '$19.99', tag: '+30%' },
  { coins: 7000, price: '$49.99', tag: 'Best value' },
];

const GUIDE_LINES = [
  ['Ahoy, CaptainOr!', 'Big matches tonight. Grab your crew and start a party!'],
  ['Liverpool vs City', 'Kick-off at 21:00. Six lobbies are filling up!'],
  ['Daily Deals are in!', 'Fresh gear in the Market. Go take a look!'],
  ['Your crew is here!', 'Noa and Dan just joined a lobby. Jump in!'],
  ['Win streak bonus!', 'Win 2 more parties this week for +300 coins.'],
];

const NOTIFICATIONS = [
  ['Noa invited you to a lobby', 'Real Madrid vs Barcelona · 250 coins', '2m'],
  ['You won +450 coins', 'Maccabi Haifa 2–1 Maccabi TA', '1h'],
  ['New Daily Deals', 'Six new items in the Market', '5h'],
];

const CREW = ['Noa', 'Dan', 'Yoni', 'Maya', 'Avi', 'Tal'];
