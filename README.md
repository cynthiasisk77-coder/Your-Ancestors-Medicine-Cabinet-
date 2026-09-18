# The Forgotten Remedy Cabinet

A real, installable phone app (iOS + Android, built with Expo) preserving historical American folk and traditional medicine — Native nations, immigrant communities, and settler traditions, circa 1600s to the early 1900s.

The archive content works offline: all 942 entries and 774 photo files are bundled into the app. Source links in the photo-credit and formula panels require an internet connection. Photos are assigned to 915 entries; the other 27 entries display an explicit “No verified image available” state because no accurate, reusable image could be independently verified.

## What's in the app

- **857 entries marked confirmed in the supplied dataset.** Eight now have a measured primary-source formula. The other 849 do not include a record-level citation, so the app explicitly says that their narratives could not be reproduced claim by claim from the available project files.
- **85 entries that could not be independently verified** (hidden from Browse by default, with a toggle to show them). Their cards, detail pages, and shared text now say so explicitly. Nineteen also carry a red do-not-use warning.
- Safety cautions on 441 entries. The app presents the collection as a historical archive, not medical advice or treatment instructions.
- **Complete photo ledger for all 774 bundled files:** 414 have a traced source/license; 360 have a source or license that could not be fully verified and are retained with an explicit warning. Ten additional verified credit rows for currently unbundled files are preserved in the CSV archive.
- **Safety-gated historical formulas:** 8 measured preparations are linked to primary historical sources and modern safety references. No formula is shown for a cautioned or known hazardous entry.
- **Complete content audit:** `CONTENT_AUDIT.json` gives every entry a checked disposition for claim sourcing, photo provenance, USDA range verification, formula publication, and caution status.
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
- `CONTENT_AUDIT.json` — one verification disposition for each of the 942 entries
- `assets/plant-images/` — all 774 photo files, bundled into the app
- `PHOTO_CREDITS.csv` — one provenance row for every bundled photo file, plus 10 preserved archival rows for currently unbundled files
- `src/data/photo-credits.json` — the in-app photo-credit data
- `src/data/historical-formulas.json` — measured historical formulas that passed the primary-source and safety gate
- `src/components/EntryCard.tsx` — the card shown in the browse grid

## Status

This is the real app, replacing the earlier web preview. Its content is explicitly dispositioned rather than silently guessed. The production configuration passes Expo Doctor and export checks. An Android preview APK was completed on September 18, 2026 from commit `0034bc2`; later working changes require a new build before they appear in that APK.
