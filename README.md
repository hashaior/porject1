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
| Swords | Matches with search, filters and Create Lobby |
| Grid | Results: final scores with expandable match details, league and day filters |
| Profile | Profile with avatar picker, Add Friends, friends list with each friend's stats, and Wardrobe |

On Home, the wheel button next to Sharko opens the Lucky Wheel: one free spin a day, prizes up to 500 coins, some slices win nothing.

What works in the demo:
- Top up adds coins to the balance
- Create Lobby takes the entry coins and creates a lobby code
- Profile: pick an animal avatar, equip hats and glasses in the Wardrobe (saved in the browser)
- Results: tap a match to expand it, filter by league or day
- The filters and search on Matches update the list and the count
- Balance and purchases are saved in the browser (localStorage)

## Files

- `index.html` – the screens
- `css/style.css` – styles for Home, Market, Matches and shared parts
- `css/results.css`, `css/profile.css` – the styles from `results-screen.html` and `profile-screen_1.html`, scoped to their screens
- `js/data.js` – the demo data (teams, matches, results, items)
- `js/app.js` – the app logic
- `js/market.js`, `css/market.css` – the Market
- `js/wheel.js`, `css/wheel.css` – the Lucky Wheel
- `js/auth.js`, `css/auth.css` – loading, sign-in and create-account screens
- `js/results.js`, `js/profile.js` – the Results and Profile screens, from the two design files
- `assets/fonts/` – Lilita One, Manrope and Bungee, the fonts used in the designs
- `assets/img/` – images. These were cut from the design screenshots, so they are low resolution. Replace them with the original artwork, keeping the same file names.
  - `home-bg.jpg` is the full Home design. The live buttons and texts sit exactly on top of the drawn ones. With a clean background image (no buttons in it) the result will be sharper.
