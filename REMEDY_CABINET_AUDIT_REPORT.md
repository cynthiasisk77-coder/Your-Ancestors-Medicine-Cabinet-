# Remedy Cabinet Photo and Data Audit

Audit date: 2026-09-18

## Outcome

The photo collection, photo mappings, and photo-credit data are internally consistent. The app now assigns photos to 915 of 942 entries. Twenty-seven entries remain without a photo because no accurate, reusable image could be independently verified. Those entries now show a deliberate “No verified image available” panel instead of an unexplained blank or a misleading substitute.

The States feature now searches verified botanical ranges instead of historical-use locations. Exact scientific-name matches against the USDA NRCS PLANTS Database produced state ranges for 526 entries. The safe default view contains 474 confirmed remedy records and now returns 61–333 results per state, rather than the prior 0–46 historical-location tags.

Every archive record now has an explicit disposition in `CONTENT_AUDIT.json` for claim sourcing, photo provenance, USDA range verification, formula publication, and caution status. The app also shows the applicable archive-source limitation on every entry detail page.

## Changes made

| Item | Before | After | Change |
|---|---:|---:|---:|
| Entries | 942 | 942 | 0 |
| Entries with photos | 835 | 915 | +80 |
| Entries without photos | 107 | 27 | -80 |
| Photo files | 706 | 774 | +68 net |
| Complete bundled photo-credit rows | Incomplete legacy ledger | 774 | One row per bundled photo, plus 10 preserved archival rows for currently unbundled files |
| Photos with traced source/license | Not reliably countable from the old ledger | 414 | Verified source links retained |
| Photos with a source or license that could not be fully verified | Not clearly marked | 360 | Retained and explicitly marked |

- Added 67 source-backed photo files in the earlier pass, plus one exact-species Pacific dulse image in the final pass.
- The Pacific dulse subject and credited creator were identified, but its license could not be independently verified; the app and both credit ledgers say so explicitly.
- Replaced 2 existing images after visual review:
  - `apple-cider-vinegar-tonic.jpg` was an unrelated winter-tree photograph.
  - `red-alder-bark-wash.jpg` was replaced with an exact-species image showing useful bark context.
- Reused 5 already verified photos where the visual subject was directly relevant, with contextual limitations included in the credit notes.
- Rebuilt `PHOTO_CREDITS.csv` and the in-app `src/data/photo-credits.json` so every bundled photo has exactly one provenance record. The CSV also preserves 10 verified attribution rows from the prior catalog for image files that are not currently bundled.
- Added visible photo credits and source links to entry detail pages.
- Added explicit warnings for legacy photos whose source, creator, and license could not be independently verified.
- Changed all 85 unverified entry labels and shared text to say that the information could not be independently verified. Nineteen of those entries also retain a do-not-use warning.
- Added a historical-archive notice stating that the records are not medical advice or treatment instructions.
- Added a visible archive-source status to every entry. Eight entries now link to measured primary-source formulas; 849 supplied-confirmed records without a record-level citation are explicitly labeled as not reproducible claim by claim; all 85 supplied-unconfirmed records remain explicitly unverified.
- Added measured, primary-source formulas for nonalcoholic lemon whey and Irish moss blanc-mange from Eliza A. Pitkin and Julia A. Pye’s 1880 *Invalid Cookery*, with modern pasteurization, allergy, infant-feeding, and iodine cautions.
- Added `CONTENT_AUDIT.json`, with one checked disposition for every one of the 942 entries, and a validator that fails if any entry, image, credit, range, or formula falls out of sync.
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
| Source or license could not be fully verified | 360 | Keeps the image and displays an explicit warning |
| Total | 774 | Every file has a CSV and in-app credit record |

The 414 verified files consist of 345 existing photos matched to the recovered Wikimedia manifests plus 69 manually reviewed source-backed additions or replacements. Pacific dulse is counted among the 360 retained-but-unverified files because its reuse license could not be independently established.

## Entries still without a verified photo

These entries were left blank rather than filled with a misleading or unlicensed image:

1. Root Bark Worm Tea
2. Bark Chew for Heartburn
3. Root Eyewash
4. Gum-Tree Leaves — entry itself could not be independently verified
5. John the Conqueror Root (High John Root)
6. Black Snakeroot — entry itself could not be independently verified
7. Saltwater Joint Soak — entry itself could not be independently verified
8. Resguardo (Forty Days of Postpartum Care)
9. Quebranto and the Benzedeira's Blessing
10. Frotter avec de la Neige (Rubbing Frostbite with Snow)
11. Blessing of Herbs (Sviachennia Zillia)
12. Fire Cider (Master Tonic)
13. Black Drawing Salve
14. The Dry Hot Salt Bag
15. Written Bread Charm for Fever
16. Cradle Dolls Against the Huldrefolk
17. Flour, Butter & Egg Poultice
18. Nine Days of Postpartum Bed Rest
19. Urine Wash for Burns & Eye Complaints
20. Seventh Son of a Seventh Son
21. Railroad Camp Medicine Vials
22. Mari Simonson, Neighbor-Midwife
23. Severin Almklov's “Itch Specific”
24. Norwegian-Language Doctor Books
25. Dråper (Herb Drops)
26. David Keaweamahi's Journey to Japan
27. Benedicaria (The Things We Do)

## Triple-check results

| Check | Result |
|---|---|
| Entry count and unique IDs | Pass: 942 entries and 942 unique IDs |
| Required entry fields | Pass: 0 missing required shapes |
| Image decoding | Pass: all 774 JPEG files readable |
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
| Expo Doctor | Pass: 21 of 21 checks |
| Production web export | Pass: Metro bundled 1,598 modules and exported all app assets |
| Git whitespace check | Pass: `git diff --check` |
| Protected-project boundary scan | Pass: no cross-project references in this repository |
| State rows present | Pass: all 50 states plus D.C. |
| State-search minimum/maximum | Pass: 61–333 confirmed records per state |
| Range source shape | Pass: every included entry has at least one state, scientific-name match, and USDA profile link |
| State code validation | Pass: 0 invalid codes |
| Independent USDA range sample | Pass: 10 of 10 generated records exactly matched a fresh state-layer query |
| Complete content ledger | Pass: 942 records, 942 unique dispositions |
| Historical formula safety gate | Pass: 8 measured formulas; 441 cautioned entries excluded |

Fifty-six readable source images are below the preferred 640-pixel long edge. They were not artificially upscaled because that would add no real detail.

`npm run lint` could not complete because Expo attempted to install/configure lint dependencies and the network proxy timed out. It made no project-file changes. TypeScript and Expo configuration checks both passed.

An Android preview APK was completed on September 18, 2026 from commit `0034bc2`. The interface and formula changes documented in this revision require a new build before they appear in that APK.

## Verification limit

The supplied archive still does not include record-level historical citations for most narratives. Eight measured formulas now have primary-source citations, but each citation verifies only the formula and the limited scope stated in its Source Fit note. The other 849 supplied-confirmed narratives cannot be independently reproduced claim by claim from the available project files; the app and audit ledger now say so directly instead of treating the supplied flag as proof.

The 85 entries already marked unconfirmed continue to state clearly that they could not be independently verified. Existing content was retained rather than silently rewritten or deleted.
