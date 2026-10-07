# Sharko Matches (demo app)

A clickable demo of the app built from the design screens. All data is fake and only there for illustration.

## Run it

Open `index.html` in a browser. The app is laid out on a fixed 390 × 844 phone canvas measured from the design files and scaled to fit the window. On a computer it shows inside a phone frame.

Or serve the folder:

```
npx http-server .
```

## Screens

The app opens on a loading screen, then Sign in. From Sign in you can create an account (or continue as a guest). Signing out from Profile brings you back to Sign in.

The bottom bar is the same on every screen:

| Tab | Screen |
| --- | --- |
| Home | Home with Sharko the guide, tips carousel, Play Now |
| Wallet | Market: daily deal, hats/eyes/extras that go straight into the Wardrobe, coin chests |
| Swords | Matches with search, filters and Create Lobby. After you create a lobby, this tab becomes the lobby waiting room (crew seats, total pot, scoreboard, chat) until you leave |
| Scoreboard | Results: final scores with expandable match details, league and day filters |
| Profile | Profile with avatar picker, Add Friends, friends list with each friend's stats, and Wardrobe |

On Home, the wheel button next to Sharko opens the Lucky Wheel: one free spin a day, prizes up to 500 coins, some slices win nothing.

What works in the demo:
- Top up adds coins to the balance
- Create Lobby takes the entry coins and creates a private lobby with a code
- Join with code (Matches screen) or tap an invite in the notifications. Demo codes: NOA7, MAYA
- Top up and the Market's Treasure Chests sell the same coin packs
- Profile: pick an animal avatar, equip hats and glasses in the Wardrobe (saved in the browser)
- Results: tap a match to expand it, filter by league or day
- The filters and search on Matches update the list and the count
- Balance and purchases are saved in the browser (localStorage)

## The game

1. **Picks before kick-off** (in the lobby waiting room): 5 questions worth up to 250 points: winner, first goal, both teams score, over/under 2.5 goals, exact score. Friends lock in their picks too.
2. **Kick off now (demo)**: real matches need a live-data API, so the demo plays an invented, scripted match of about 5 minutes with the lobby's two teams. A 2× speed button is in the scoreboard.
3. **Live match**: scoreboard, pitch with the ball, match feed, live leaderboard, chat and "my points". At 8 big moments (corner, penalty, VAR, free kick…) a live question opens for 15 seconds. If you are on another screen, a notification banner pops up and takes you to the question.
4. **Full time**: podium, the pot is split 60/30/10 (or winner takes all with fewer than 3 players), COLLECT adds your prize and a 1st place counts as a win in your stats.

The match script (events, live questions, answers and points) is at the top of `js/game.js`.

## Files

- `index.html` – the screens
- `css/style.css` – styles for Home, Market, Matches and shared parts
- `css/results.css`, `css/profile.css` – the styles from `results-screen.html` and `profile-screen_1.html`, scoped to their screens
- `js/data.js` – the demo data (teams, matches, results, items)
- `js/app.js` – the app logic
- `js/stats.js` – your stats and the 12 achievements (they update from lobbies, the wheel, the Market and chat)
- `js/market.js`, `css/market.css` – the Market
- `js/wheel.js`, `css/wheel.css` – the Lucky Wheel
- `js/lobby.js`, `css/lobby.css` – the lobby waiting room
- `js/game.js`, `css/game.css` – picks, the live match with live questions, and full time
- `js/auth.js`, `css/auth.css` – loading, sign-in and create-account screens
- `js/results.js`, `js/profile.js` – the Results and Profile screens, from the two design files
- `assets/fonts/` – Lilita One, Manrope and Bungee, the fonts used in the designs
- `assets/img/` – images. These were cut from the design screenshots, so they are low resolution. Replace them with the original artwork, keeping the same file names.
  - `home-bg.jpg` is the full Home design. The live buttons and texts sit exactly on top of the drawn ones. With a clean background image (no buttons in it) the result will be sharper.
