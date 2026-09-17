# The Forgotten Remedy Cabinet

A real, installable phone app (iOS + Android, built with Expo) preserving historical American folk and traditional medicine — Native nations, immigrant communities, and settler traditions, circa 1600s to the early 1900s.

The archive content works offline: all 942 entries and 773 photo files are bundled into the app. Source links in the photo-credit panels require an internet connection. Photos are assigned to 914 entries; 28 entries remain without a photo because no accurate, reusable image could be independently verified.

## What's in the app

- **857 entries marked confirmed in the supplied dataset.** The repository does not include a claim-by-claim source ledger, so that status could not be independently reproduced during this audit.
- **85 entries that could not be independently verified** (hidden from Browse by default, with a toggle to show them). Their cards, detail pages, and shared text now say so explicitly. Nineteen also carry a red do-not-use warning.
- Safety cautions on 441 entries. The app presents the collection as a historical archive, not medical advice or treatment instructions.
- **Complete photo ledger for all 773 bundled files:** 414 have a traced Wikimedia source/license; 359 legacy photos have no recoverable source in the supplied records and are retained with an explicit warning. Ten additional verified credit rows for currently unbundled files are preserved in the CSV archive.
- **Search** by name, ailment, or people
- **Filter** by tradition (a proper picker, not a cramped chip row) and by region
- **Traditions tab** — browse by community, with counts
- **States tab** — search all 50 states plus D.C. by verified USDA plant distribution, with exact scientific-name matching and source links
- A quick region filter also sits right on the Browse screen, for fast broad narrowing without leaving the list
- **Share button** on every entry, to send one remedy to someone else

## Trying it out

This is a normal [Expo](https://expo.dev) app. To run it:

```bash
npm install
npx expo start
```

That prints a QR code — scan it with the **Expo Go** app on your phone (free, App Store / Play Store) to open this app live on your own device. No account or build step needed for that.

To eventually publish it to the App Store / Play Store, this project connects to [expo.dev](https://expo.dev) via **EAS** (Expo Application Services) — that's a separate step for later, once the app itself is finished.

## Project layout

- `src/app/` — the screens (file-based routing via `expo-router`)
  - `(tabs)/index.tsx` — Browse screen (search, filters, grid)
  - `(tabs)/explore.tsx` — Regions screen
  - `(tabs)/traditions.tsx` — Traditions (community) screen
  - `entry/[id].tsx` — one remedy's full detail page
- `src/data/entries.json` — all 942 entries
- `src/data/plant-state-ranges.json` — cited USDA botanical range data used by state search
- `PLANT_STATE_RANGE_AUDIT.json` — every record excluded from state search and the reason it could not be verified
- `assets/plant-images/` — all 773 photo files, bundled into the app
- `PHOTO_CREDITS.csv` — one provenance row for every bundled photo file, plus 10 preserved archival rows for currently unbundled files
- `src/data/photo-credits.json` — the in-app photo-credit data
- `src/components/EntryCard.tsx` — the card shown in the browse grid

## Status

This is the real app, replacing the earlier web preview. It type-checks cleanly and its Expo configuration resolves successfully. A new EAS/store build has deliberately not been started yet; live-device testing and the release build remain the next steps after the remaining image decisions are accepted.
