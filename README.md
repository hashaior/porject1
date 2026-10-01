# Sharko Matches (demo app)

A clickable demo of the app built from the design screens. All data is fake and only there for illustration.

## Run it

Open `index.html` in a browser. On a computer it shows inside a phone frame; on a phone it fills the screen.

Or serve the folder:

```
npx http-server .
```

## Screens

The bottom bar is the same on every screen:

| Tab | Screen |
| --- | --- |
| Home | Home with Sharko the guide, tips carousel, Play Now |
| Wallet | Market with Daily Deals (each price shows once) |
| Swords | Matches with search, filters and Create Lobby |
| Grid | Results of finished parties |
| Profile | Profile, collection, crew and settings |

What works in the demo:
- Top up adds coins to the balance
- Create Lobby takes the entry coins and creates a lobby code
- Buying a Market item adds it to your Profile collection
- The filters and search on Matches update the list and the count
- Balance and purchases are saved in the browser (localStorage)

## Files

- `index.html` – the screens
- `css/style.css` – styles
- `js/data.js` – the demo data (teams, matches, results, items)
- `js/app.js` – the app logic
- `assets/img/` – images. These were cut from the design screenshots, so they are low resolution. Replace them with the original artwork, keeping the same file names.
