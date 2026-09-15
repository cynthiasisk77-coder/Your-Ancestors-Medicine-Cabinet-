# The Forgotten Remedy Cabinet

A real, installable phone app (iOS + Android, built with Expo) preserving historical American folk and traditional medicine — Native nations, immigrant communities, and settler traditions, circa 1600s to the early 1900s.

Everything works fully offline: all 924 entries and 646 plant photos are bundled into the app itself, so it needs zero internet connection once installed.

## What's in the app

- **840 confirmed entries** — who used a remedy, what it was for, how it was made, and the real story behind it
- **84 unconfirmed research leads** — real, sourced plants and materials that came up in research but didn't have enough documented detail for a full write-up yet (hidden from Browse by default — there's a toggle to show them). 18 of those are flagged as genuinely dangerous with a red warning badge.
- Real safety cautions on 418 entries where one was warranted — not invented, only added where a real risk is documented
- **Search** by name, ailment, or people
- **Filter** by tradition (a proper picker, not a cramped chip row) and by region
- **Traditions tab** — browse by community, with counts
- **Regions tab** — browse by where a remedy comes from
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
- `src/data/entries.json` — all 924 entries
- `assets/plant-images/` — all 646 photos, bundled into the app
- `src/components/EntryCard.tsx` — the card shown in the browse grid

## Status

This is the real app, replacing the earlier web preview. It's been verified to type-check cleanly and to build successfully for iOS, Android, and web. It hasn't yet been tested live on a device — that's the next step.
