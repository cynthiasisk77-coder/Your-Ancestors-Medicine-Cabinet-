import { readdirSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const entries = readJson('src/data/entries.json');
const formulas = readJson('src/data/historical-formulas.json');
const photoCredits = readJson('src/data/photo-credits.json');
const stateRangeData = readJson('src/data/plant-state-ranges.json');
const audit = readJson('CONTENT_AUDIT.json');
const staticImageMap = readFileSync(new URL('src/data/plant-images.ts', root), 'utf8');
const csv = readFileSync(new URL('PHOTO_CREDITS.csv', root), 'utf8');
const assets = readdirSync(new URL('assets/plant-images/', root)).filter((name) => name.endsWith('.jpg')).sort();
const allowedStates = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  assert(!quoted, 'PHOTO_CREDITS.csv has an unclosed quoted field');
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

assert(entries.length === 942, `Expected 942 entries, found ${entries.length}`);
const entryIds = new Set();
for (const entry of entries) {
  assert(!entryIds.has(entry.id), `Duplicate entry id: ${entry.id}`);
  entryIds.add(entry.id);
  for (const key of ['id', 'name', 'people', 'community', 'region', 'use']) {
    assert(typeof entry[key] === 'string' && entry[key].trim(), `Missing required ${key} on ${entry.id}`);
  }
  assert(typeof entry.confirmed === 'boolean', `Invalid confirmed flag on ${entry.id}`);
  assert(Array.isArray(entry.state), `Invalid historical state list on ${entry.id}`);
  for (const state of entry.state) assert(allowedStates.has(state), `Invalid state ${state} on ${entry.id}`);
}

const formulaEntryIds = new Set(formulas.map((formula) => formula.entry_id));
const auditById = new Map(audit.records.map((record) => [record.entry_id, record]));
assert(audit.records.length === entries.length, 'CONTENT_AUDIT.json does not contain one row per entry');
assert(auditById.size === entries.length, 'CONTENT_AUDIT.json contains duplicate or missing entry ids');

const mappedImages = [...staticImageMap.matchAll(/"([^"]+\.jpg)": require/g)].map((match) => match[1]).sort();
assert(JSON.stringify(mappedImages) === JSON.stringify(assets), 'Static image map and bundled JPEG files differ');
assert(Object.keys(photoCredits).length === assets.length, 'Photo-credit JSON and bundled JPEG counts differ');

for (const filename of assets) {
  assert(photoCredits[filename], `Missing JSON photo credit for ${filename}`);
  assert(photoCredits[filename].filename === filename, `Photo-credit filename mismatch for ${filename}`);
  const bytes = readFileSync(new URL(`assets/plant-images/${filename}`, root));
  assert(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9, `Unreadable JPEG signature: ${filename}`);
  const credit = photoCredits[filename];
  if (credit.verification_status === 'verified_from_wikimedia_manifest') {
    assert(credit.license && credit.source_page, `Incomplete verified credit: ${filename}`);
  } else {
    assert(credit.verification_status === 'unverified_source_retained', `Invalid credit status: ${filename}`);
    assert(/could not be independently verified/i.test(credit.license), `Unverified license not labeled: ${filename}`);
    assert(credit.notes, `Unverified photo lacks a retention note: ${filename}`);
  }
}

for (const entry of entries) {
  if (entry.img) {
    assert(assets.includes(entry.img.value), `Broken image reference on ${entry.id}: ${entry.img.value}`);
    assert(photoCredits[entry.img.value], `Missing photo credit on ${entry.id}: ${entry.img.value}`);
  }
  const expectedClaim = formulaEntryIds.has(entry.id)
    ? 'measured_formula_primary_source_only'
    : entry.confirmed
      ? 'record_level_citation_not_available'
      : 'could_not_be_independently_verified';
  const expectedPhoto = !entry.img
    ? 'no_verified_image_available'
    : photoCredits[entry.img.value].verification_status === 'verified_from_wikimedia_manifest'
      ? 'source_and_license_traced'
      : 'source_or_license_not_independently_verified_retained';
  const expectedRange = stateRangeData.ranges[entry.id]
    ? 'verified_usda_exact_scientific_name_match'
    : 'no_verified_usda_exact_match';
  const expectedFormula = formulaEntryIds.has(entry.id)
    ? 'verified_primary_source_formula_published'
    : entry.caution
      ? 'excluded_from_formula_release_caution'
      : 'no_measured_primary_source_formula_published';
  const row = auditById.get(entry.id);
  assert(row, `Missing content-audit row for ${entry.id}`);
  assert(row.claim_source_status === expectedClaim, `Wrong claim-source disposition for ${entry.id}`);
  assert(row.photo_status === expectedPhoto, `Wrong photo disposition for ${entry.id}`);
  assert(row.botanical_range_status === expectedRange, `Wrong range disposition for ${entry.id}`);
  assert(row.formula_status === expectedFormula, `Wrong formula disposition for ${entry.id}`);
  assert(row.caution_present === Boolean(entry.caution), `Wrong caution disposition for ${entry.id}`);
}

for (const [entryId, range] of Object.entries(stateRangeData.ranges)) {
  assert(entryIds.has(entryId), `State range points to missing entry: ${entryId}`);
  assert(range.states.length > 0, `State range has no states: ${entryId}`);
  assert(range.scientific_names.length === range.source_profiles.length, `Range source mismatch: ${entryId}`);
  for (const state of range.states) assert(allowedStates.has(state), `Invalid USDA range state ${state}: ${entryId}`);
  for (const url of range.source_profiles) assert(url.startsWith('https://'), `Invalid range URL: ${entryId}`);
}

const csvRows = parseCsv(csv);
const csvHeader = csvRows[0];
assert(csvHeader.join(',') === 'filename,label,license,license_url,creator,credit,source_page,original_url,verification_status,notes', 'Unexpected photo-credit CSV header');
const csvFilenames = csvRows.slice(1).map((row) => row[0]);
assert(new Set(csvFilenames).size === csvFilenames.length, 'Duplicate filename in PHOTO_CREDITS.csv');
const csvByFilename = new Map(csvRows.slice(1).map((row) => [row[0], Object.fromEntries(csvHeader.map((key, index) => [key, row[index] ?? '']))]));
for (const filename of assets) {
  assert(csvFilenames.includes(filename), `Missing CSV photo credit for ${filename}`);
  const csvCredit = csvByFilename.get(filename);
  for (const key of csvHeader) {
    assert(csvCredit[key] === photoCredits[filename][key], `CSV/JSON credit mismatch for ${filename}: ${key}`);
  }
}

const stateCounts = Object.fromEntries([...allowedStates].map((state) => [state, 0]));
for (const entry of entries.filter((item) => item.confirmed)) {
  for (const state of stateRangeData.ranges[entry.id]?.states ?? []) stateCounts[state] += 1;
}
for (const [state, total] of Object.entries(stateCounts)) assert(total > 0, `State search has no confirmed results for ${state}`);

const summary = audit.summary;
assert(summary.entries === entries.length, 'Incorrect audit entry total');
assert(summary.photo_status.entry_photo_assignments === entries.filter((entry) => entry.img).length, 'Incorrect image-assignment total');
assert(summary.photo_status.bundled_photo_files === assets.length, 'Incorrect bundled-photo total');
assert(summary.botanical_range_status.verified_usda_exact_scientific_name_match === Object.keys(stateRangeData.ranges).length, 'Incorrect verified-range total');
assert(summary.formula_status.verified_primary_source_formula_published === formulas.length, 'Incorrect formula total');

console.log(`Validated ${entries.length} entry dispositions, ${assets.length} JPEGs, ${Object.keys(stateRangeData.ranges).length} USDA ranges, and ${formulas.length} formulas.`);
