# Remedy Cabinet Photo and Data Audit

Audit date: 2026-09-17

## Outcome

The photo collection, photo mappings, and photo-credit data are internally consistent. The app now assigns photos to 914 of 942 entries. Twenty-eight entries remain without a photo because no accurate, reusable image could be independently verified.

The States feature now searches verified botanical ranges instead of historical-use locations. Exact scientific-name matches against the USDA NRCS PLANTS Database produced state ranges for 526 entries. The safe default view contains 474 confirmed remedy records and now returns 61–333 results per state, rather than the prior 0–46 historical-location tags.

No files, directories, code, storage, deployment settings, or upload paths belonging to the protected separate project were opened or changed.

## Changes made

| Item | Before | After | Change |
|---|---:|---:|---:|
| Entries | 942 | 942 | 0 |
| Entries with photos | 835 | 914 | +79 |
| Entries without photos | 107 | 28 | -79 |
| Photo files | 706 | 773 | +67 net |
| Complete bundled photo-credit rows | Incomplete legacy ledger | 773 | One row per bundled photo, plus 10 preserved archival rows for currently unbundled files |
| Photos with traced source/license | Not reliably countable from the old ledger | 414 | Verified source links retained |
| Legacy photos without recoverable provenance | Not clearly marked | 359 | Retained and explicitly marked |

- Added 67 new source-backed photo files.
- Replaced 2 existing images after visual review:
  - `apple-cider-vinegar-tonic.jpg` was an unrelated winter-tree photograph.
  - `red-alder-bark-wash.jpg` was replaced with an exact-species image showing useful bark context.
- Reused 5 already verified photos where the visual subject was directly relevant, with contextual limitations included in the credit notes.
- Rebuilt `PHOTO_CREDITS.csv` and the in-app `src/data/photo-credits.json` so every bundled photo has exactly one provenance record. The CSV also preserves 10 verified attribution rows from the prior catalog for image files that are not currently bundled.
- Added visible photo credits and source links to entry detail pages.
- Added explicit warnings for legacy photos whose source, creator, and license could not be independently verified.
- Changed all 85 unverified entry labels and shared text to say that the information could not be independently verified. Nineteen of those entries also retain a do-not-use warning.
- Added a historical-archive notice stating that the records are not medical advice or treatment instructions.
- Updated outdated README totals and removed the prior unsupported claim that a current release build had passed.
- Fixed every tab-to-Browse route to use the SDK 57 URL (`/`) rather than the invisible `/(tabs)` route-group name.
- Made the header search button clear stale filters and search text, navigate to Browse, and focus the search field.
- Prevented stale tradition or region filters from silently narrowing state results.
- Rebuilt the States screen as an alphabetical, searchable list of all 50 states plus D.C.
- Added USDA range citations on the States screen and each matched entry detail page.
- Kept all 416 unmatched records out of botanical state results and recorded the exact reason in `PLANT_STATE_RANGE_AUDIT.json`.

## Botanical state-range status

| Status | Entries | App behavior |
|---|---:|---|
| Exact scientific-name match with USDA state distribution | 526 | Included in every state reported by USDA, with profile citation links |
| No verified USDA state range | 416 | Excluded from state results; the app does not guess |
| Confirmed remedy entries with verified range | 474 | Used for the count shown on each state row by default |

Source: USDA NRCS PLANTS Database, retrieved 2026-09-17. The generated range file records the source, retrieval date, method, caveat, scientific-name matches, and USDA profile links. Absence from the generated file means “not verified by this process,” not proof that a plant is absent from a state.

## Photo provenance status

| Status | Photo files | App behavior |
|---|---:|---|
| Source and license independently traced | 414 | Shows creator, license, context note, and source link |
| Legacy source could not be independently verified | 359 | Keeps the owner-supplied image and displays an explicit warning |
| Total | 773 | Every file has a CSV and in-app credit record |

The 414 verified files consist of 345 existing photos matched to the recovered Wikimedia manifests plus 69 manually reviewed source-backed additions or replacements.

## Entries still without a verified photo

These entries were left blank rather than filled with a misleading or unlicensed image:

1. Root Bark Worm Tea
2. Bark Chew for Heartburn
3. Root Eyewash
4. Dulse (Pacific)
5. Gum-Tree Leaves — entry itself could not be independently verified
6. John the Conqueror Root (High John Root)
7. Black Snakeroot — entry itself could not be independently verified
8. Saltwater Joint Soak — entry itself could not be independently verified
9. Resguardo (Forty Days of Postpartum Care)
10. Quebranto and the Benzedeira's Blessing
11. Frotter avec de la Neige (Rubbing Frostbite with Snow)
12. Blessing of Herbs (Sviachennia Zillia)
13. Fire Cider (Master Tonic)
14. Black Drawing Salve
15. The Dry Hot Salt Bag
16. Written Bread Charm for Fever
17. Cradle Dolls Against the Huldrefolk
18. Flour, Butter & Egg Poultice
19. Nine Days of Postpartum Bed Rest
20. Urine Wash for Burns & Eye Complaints
21. Seventh Son of a Seventh Son
22. Railroad Camp Medicine Vials
23. Mari Simonson, Neighbor-Midwife
24. Severin Almklov's “Itch Specific”
25. Norwegian-Language Doctor Books
26. Dråper (Herb Drops)
27. David Keaweamahi's Journey to Japan
28. Benedicaria (The Things We Do)

## Triple-check results

| Check | Result |
|---|---|
| Entry count and unique IDs | Pass: 942 entries and 942 unique IDs |
| Required entry fields | Pass: 0 missing required shapes |
| Image decoding | Pass: all 773 JPEG files readable |
| Broken entry image references | Pass: 0 |
| Duplicate image bytes | Pass: 0 groups |
| Orphan photo files | Pass: 0 |
| Missing static image mappings | Pass: 0 |
| Missing CSV credit rows | Pass: 0 |
| Missing in-app JSON credit rows | Pass: 0 |
| Bundled CSV/JSON credit mismatches | Pass: 0; 10 intentionally preserved CSV-only rows describe currently unbundled files |
| Duplicate credit rows | Pass: 0 |
| TypeScript | Pass: `npx tsc --noEmit` |
| Expo configuration | Pass: Expo SDK 57 config resolves for iOS, Android, and web |
| Git whitespace check | Pass: `git diff --check` |
| Protected-project boundary scan | Pass: no cross-project references in this repository |
| State rows present | Pass: all 50 states plus D.C. |
| State-search minimum/maximum | Pass: 61–333 confirmed records per state |
| Range source shape | Pass: every included entry has at least one state, scientific-name match, and USDA profile link |
| State code validation | Pass: 0 invalid codes |
| Independent USDA range sample | Pass: 10 of 10 generated records exactly matched a fresh state-layer query |

Fifty-six readable source images are below the preferred 640-pixel long edge. They were not artificially upscaled because that would add no real detail.

`npm run lint` could not complete because Expo attempted to install/configure lint dependencies and the network proxy timed out. It made no project-file changes. TypeScript and Expo configuration checks both passed.

No EAS/store build was started, in accordance with the decision to wait until the remaining photo choices are settled.

## Verification limit

The repository does not contain a per-entry bibliography or claim-to-source ledger for the 942 historical records. Therefore, the supplied `confirmed` status on 857 entries cannot be independently reproduced claim by claim from this repository alone. The audit verified data structure, internal consistency, safety labeling, image identity, and photo provenance; it did not falsely certify unsupported historical or medical claims.

The 85 entries already marked unconfirmed now state clearly in the interface that they could not be independently verified. Existing content was retained rather than silently rewritten or deleted.
