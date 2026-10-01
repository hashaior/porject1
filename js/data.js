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
  MCI: ['Man City', '#6cabdd', '#fff', 'Etihad Stadium, Manchester'],
  ARS: ['Arsenal', '#ef0107', '#fff', 'Emirates Stadium, London'],
  CHE: ['Chelsea', '#034694', '#fff', 'Stamford Bridge, London'],
  MUN: ['Man United', '#da291c', '#fff', 'Old Trafford, Manchester'],
  TOT: ['Tottenham', '#f4f4f4', '#132257', 'Tottenham Hotspur Stadium, London'],
  NEW: ['Newcastle', '#2b2b2b', '#fff', "St James' Park, Newcastle"],
  AVL: ['Aston Villa', '#670e36', '#fff', 'Villa Park, Birmingham'],
  RMA: ['Real Madrid', '#f4f4f4', '#1a2b5c', 'Santiago Bernabéu, Madrid'],
  BAR: ['Barcelona', '#a50044', '#fff', 'Spotify Camp Nou, Barcelona'],
  ATM: ['Atlético', '#cb3524', '#fff', 'Metropolitano, Madrid'],
  SEV: ['Sevilla', '#f4f4f4', '#d81920', 'Sánchez-Pizjuán, Seville'],
  RSO: ['Real Sociedad', '#0067b1', '#fff', 'Anoeta, San Sebastián'],
  VIL: ['Villarreal', '#ffe667', '#5a4a00', 'La Cerámica, Villarreal'],
  MTA: ['Maccabi TA', '#ffd200', '#1a2a6c', 'Bloomfield, Tel Aviv'],
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

// [league, home, away, days from today, kickoff]
const FIXTURES = [
  ['epl', 'LIV', 'MCI', 0, '21:00'],
  ['laliga', 'RMA', 'BAR', 0, '22:00'],
  ['ligat', 'MTA', 'HBS', 0, '20:30'],
  ['seriea', 'INT', 'MIL', 0, '21:45'],
  ['epl', 'ARS', 'CHE', 1, '19:30'],
  ['bundes', 'FCB', 'BVB', 1, '19:30'],
  ['ligat', 'MHA', 'HTA', 1, '20:00'],
  ['ucl', 'MCI', 'RMA', 1, '22:00'],
  ['laliga', 'ATM', 'SEV', 2, '21:00'],
  ['epl', 'MUN', 'TOT', 2, '18:30'],
  ['seriea', 'JUV', 'NAP', 2, '21:45'],
  ['ligat', 'BEI', 'HHA', 2, '19:00'],
  ['ucl', 'BAR', 'FCB', 3, '22:00'],
  ['epl', 'NEW', 'AVL', 3, '17:00'],
  ['bundes', 'B04', 'RBL', 3, '16:30'],
  ['laliga', 'RSO', 'VIL', 4, '20:00'],
  ['epl', 'CHE', 'LIV', 4, '17:30'],
  ['ligat', 'HBS', 'MHA', 4, '20:30'],
  ['seriea', 'ROM', 'INT', 5, '20:45'],
  ['epl', 'TOT', 'ARS', 5, '16:30'],
  ['ucl', 'LIV', 'INT', 5, '22:00'],
  ['ligat', 'HTA', 'MTA', 6, '21:00'],
  ['laliga', 'BAR', 'ATM', 6, '21:00'],
  ['bundes', 'BVB', 'B04', 6, '18:30'],
  ['epl', 'MCI', 'MUN', 8, '17:30'],
  ['seriea', 'MIL', 'JUV', 8, '20:45'],
  ['ligat', 'MTA', 'BEI', 9, '20:00'],
  ['laliga', 'SEV', 'RMA', 9, '21:00'],
  ['ucl', 'ARS', 'JUV', 10, '22:00'],
  ['bundes', 'RBL', 'FCB', 10, '18:30'],
];

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
  ['Liverpool vs Man City', 'Kicks off at 21:00. 6 lobbies are already filling up.'],
  ['Daily Deals are in', 'Fresh gear in the Market. New deals drop at midnight.'],
  ['Your crew is waiting', 'Noa and Dan just joined a lobby for El Clásico.'],
  ['Streak bonus', 'Win 2 more parties this week for +300 coins.'],
];

const NOTIFICATIONS = [
  ['Noa invited you to a lobby', 'Real Madrid vs Barcelona · 250 coins', '2m'],
  ['You won +450 coins', 'Maccabi Haifa 2–1 Maccabi TA', '1h'],
  ['New Daily Deals', 'Six new items in the Market', '5h'],
];

const CREW = ['Noa', 'Dan', 'Yoni', 'Maya', 'Avi', 'Tal'];
