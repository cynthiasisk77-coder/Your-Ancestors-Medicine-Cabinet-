import { readFile, writeFile } from 'node:fs/promises';

const USDA_API = 'https://plantsservices.sc.egov.usda.gov/api';
const USDA_MAP =
  'https://apps.geo.fpac.usda.gov/nrcs-geodata/rest/services/land_use_land_cover/plants/MapServer';
const PROFILE_BASE = 'https://plants.sc.egov.usda.gov/plant-profile/';

const stateCodes = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA', Colorado: 'CO',
  Connecticut: 'CT', Delaware: 'DE', 'District of Columbia': 'DC', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY',
  Louisiana: 'LA', Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN',
  Mississippi: 'MS', Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR',
  Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD',
  Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA',
  'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
};

const entries = JSON.parse(await readFile(new URL('../src/data/entries.json', import.meta.url), 'utf8'));

function stripMarkup(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&times;/g, '×')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalBinomial(value) {
  const clean = stripMarkup(value);
  const match = clean.match(/\b([A-Z][a-z-]+)\s+(?:×\s*)?([a-z][a-z-]+)\b/);
  return match ? `${match[1]} ${match[2]}` : null;
}

function scientificCandidates(value) {
  if (!value) return [];

  const firstGenus = value.match(/\b([A-Z][a-z-]+)\s+(?:×\s*)?[a-z][a-z-]+\b/)?.[1];
  const expanded = firstGenus
    ? value.replace(/\b([A-Z])\.\s*([a-z][a-z-]+)\b/g, (match, initial, species) =>
        firstGenus.startsWith(initial) ? `${firstGenus} ${species}` : match,
      )
    : value;

  const candidates = [];
  const pattern = /\b([A-Z][a-z-]+)\s+(?:×\s*)?([a-z][a-z-]+)\b/g;
  for (const match of expanded.matchAll(pattern)) candidates.push(`${match[1]} ${match[2]}`);
  return [...new Set(candidates)];
}

async function fetchJson(url, options, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }
  throw lastError;
}

async function mapLimit(values, limit, worker) {
  const results = new Array(values.length);
  let next = 0;
  async function run() {
    while (next < values.length) {
      const index = next;
      next += 1;
      results[index] = await worker(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, run));
  return results;
}

const candidates = [...new Set(entries.flatMap((entry) => scientificCandidates(entry.sci)))].sort();
console.log(`Matching ${candidates.length} scientific names against USDA PLANTS...`);

const matches = await mapLimit(candidates, 12, async (candidate, index) => {
  if ((index + 1) % 50 === 0) console.log(`  ${index + 1}/${candidates.length}`);
  const results = await fetchJson(`${USDA_API}/PlantSearch?searchText=${encodeURIComponent(candidate)}`);
  const exact = results
    .map((result) => result.Plant)
    .filter((plant) => canonicalBinomial(plant.ScientificName) === candidate)
    .sort((a, b) => (a.Rank === 'Species' ? -1 : 1) - (b.Rank === 'Species' ? -1 : 1))[0];
  return exact ? [candidate, { id: exact.Id, symbol: exact.Symbol }] : [candidate, null];
});

const matchByName = Object.fromEntries(matches);
const plantIds = [...new Set(matches.map(([, match]) => match?.id).filter(Boolean))];
console.log(`Matched ${plantIds.length} USDA plant profiles. Reading state distributions...`);

async function queryDistributionLayer(layer) {
  const records = [];
  let offset = 0;
  const pageSize = 2000;
  while (true) {
    const body = new URLSearchParams({
      where: `plant_master_id IN (${plantIds.join(',')})`,
      outFields: 'plant_master_id,country_subdivision_name,Symbol',
      returnGeometry: 'false',
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
      orderByFields: 'plant_master_id',
      f: 'json',
    });
    const page = await fetchJson(`${USDA_MAP}/${layer}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (page.error) throw new Error(`USDA map query failed: ${JSON.stringify(page.error)}`);
    records.push(...page.features.map((feature) => feature.attributes));
    if (!page.exceededTransferLimit && page.features.length < pageSize) break;
    offset += page.features.length;
  }
  return records;
}

const distributionRecords = [
  ...(await queryDistributionLayer(4)),
  ...(await queryDistributionLayer(7)),
];
const statesByPlantId = new Map();
for (const record of distributionRecords) {
  const code = stateCodes[record.country_subdivision_name];
  if (!code) continue;
  const states = statesByPlantId.get(record.plant_master_id) ?? new Set();
  states.add(code);
  statesByPlantId.set(record.plant_master_id, states);
}

const ranges = {};
const unmatchedEntries = [];
for (const entry of entries) {
  const names = scientificCandidates(entry.sci);
  const matchedPlants = names.map((name) => ({ name, match: matchByName[name] })).filter(({ match }) => match);
  const states = [...new Set(matchedPlants.flatMap(({ match }) => [...(statesByPlantId.get(match.id) ?? [])]))].sort();
  if (states.length === 0) {
    unmatchedEntries.push({ id: entry.id, name: entry.name, scientific_name: entry.sci, reason: entry.sci ? 'no_verified_usda_state_range' : 'no_scientific_name' });
    continue;
  }

  ranges[entry.id] = {
    states,
    scientific_names: matchedPlants.map(({ name }) => name),
    source_profiles: matchedPlants.map(({ match }) => `${PROFILE_BASE}${match.id}`),
  };
}

const output = {
  metadata: {
    source: 'USDA NRCS PLANTS Database',
    source_url: 'https://plants.sc.egov.usda.gov/',
    downloads_url: 'https://plants.sc.egov.usda.gov/downloads',
    retrieved: new Date().toISOString().slice(0, 10),
    method: 'Exact scientific-name match to USDA plant profiles; state presence from USDA state-level distribution layers 4 and 7.',
    caveat: 'A state is included only when the USDA record reports the taxon there. Absence from this file means not verified by this process, not proven absent.',
  },
  ranges,
};

const audit = {
  generated: new Date().toISOString(),
  source: output.metadata.source,
  total_entries: entries.length,
  entries_with_verified_state_range: Object.keys(ranges).length,
  entries_without_verified_state_range: unmatchedEntries.length,
  matched_usda_profiles: plantIds.length,
  unmatched_reason_counts: unmatchedEntries.reduce((counts, entry) => {
    counts[entry.reason] = (counts[entry.reason] ?? 0) + 1;
    return counts;
  }, {}),
  unmatched_entries: unmatchedEntries,
};

await writeFile(
  new URL('../src/data/plant-state-ranges.json', import.meta.url),
  `${JSON.stringify(output, null, 2)}\n`,
  'utf8',
);
await writeFile(
  new URL('../PLANT_STATE_RANGE_AUDIT.json', import.meta.url),
  `${JSON.stringify(audit, null, 2)}\n`,
  'utf8',
);

console.log(JSON.stringify({ ...audit, unmatched_entries: `[${unmatchedEntries.length} records written to audit file]` }, null, 2));
