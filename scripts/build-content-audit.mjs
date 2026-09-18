import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));

const entries = readJson('src/data/entries.json');
const formulas = readJson('src/data/historical-formulas.json');
const photoCredits = readJson('src/data/photo-credits.json');
const stateRangeData = readJson('src/data/plant-state-ranges.json');
const formulaEntryIds = new Set(formulas.map((formula) => formula.entry_id));
const bundledPhotoFiles = readdirSync(new URL('assets/plant-images/', root)).filter((name) => name.endsWith('.jpg'));

const records = entries.map((entry) => {
  const credit = entry.img ? photoCredits[entry.img.value] : undefined;
  const claimSourceStatus = formulaEntryIds.has(entry.id)
    ? 'measured_formula_primary_source_only'
    : entry.confirmed
      ? 'record_level_citation_not_available'
      : 'could_not_be_independently_verified';
  const formulaStatus = formulaEntryIds.has(entry.id)
    ? 'verified_primary_source_formula_published'
    : entry.caution
      ? 'excluded_from_formula_release_caution'
      : 'no_measured_primary_source_formula_published';

  return {
    entry_id: entry.id,
    name: entry.name,
    archive_flag: entry.confirmed ? 'confirmed_in_supplied_archive' : 'unconfirmed_in_supplied_archive',
    claim_source_status: claimSourceStatus,
    photo_status: !entry.img
      ? 'no_verified_image_available'
      : credit?.verification_status === 'verified_from_wikimedia_manifest'
        ? 'source_and_license_traced'
        : 'source_or_license_not_independently_verified_retained',
    botanical_range_status: stateRangeData.ranges[entry.id]
      ? 'verified_usda_exact_scientific_name_match'
      : 'no_verified_usda_exact_match',
    formula_status: formulaStatus,
    caution_present: Boolean(entry.caution),
  };
});

const count = (key, value) => records.filter((record) => record[key] === value).length;
const summary = {
  entries: entries.length,
  confirmed_in_supplied_archive: count('archive_flag', 'confirmed_in_supplied_archive'),
  unconfirmed_in_supplied_archive: count('archive_flag', 'unconfirmed_in_supplied_archive'),
  entries_with_cautions: records.filter((record) => record.caution_present).length,
  claim_source_status: {
    measured_formula_primary_source_only: count('claim_source_status', 'measured_formula_primary_source_only'),
    record_level_citation_not_available: count('claim_source_status', 'record_level_citation_not_available'),
    could_not_be_independently_verified: count('claim_source_status', 'could_not_be_independently_verified'),
  },
  photo_status: {
    entry_photo_assignments: entries.filter((entry) => entry.img).length,
    entries_without_verified_image: entries.filter((entry) => !entry.img).length,
    bundled_photo_files: bundledPhotoFiles.length,
    source_and_license_traced_files: Object.values(photoCredits).filter(
      (credit) => credit.verification_status === 'verified_from_wikimedia_manifest',
    ).length,
    source_or_license_unverified_retained_files: Object.values(photoCredits).filter(
      (credit) => credit.verification_status === 'unverified_source_retained',
    ).length,
  },
  botanical_range_status: {
    verified_usda_exact_scientific_name_match: count(
      'botanical_range_status',
      'verified_usda_exact_scientific_name_match',
    ),
    no_verified_usda_exact_match: count('botanical_range_status', 'no_verified_usda_exact_match'),
  },
  formula_status: {
    verified_primary_source_formula_published: count(
      'formula_status',
      'verified_primary_source_formula_published',
    ),
    excluded_from_formula_release_caution: count('formula_status', 'excluded_from_formula_release_caution'),
    no_measured_primary_source_formula_published: count(
      'formula_status',
      'no_measured_primary_source_formula_published',
    ),
  },
};

const audit = {
  metadata: {
    reviewed_on: '2026-09-17',
    scope:
      'One disposition per archive entry for record sourcing, photo provenance, USDA botanical range, measured-formula publication, and caution presence.',
    verification_limit:
      'A measured formula citation verifies only the formula and the scope stated in its Source Fit note. The supplied archive confirmation flag is preserved but is not treated as reproducible claim-level sourcing when no record citation is present.',
    no_guessing_rule:
      'Missing sources, botanical ranges, photographs, and measured formulas remain explicitly unverified or unpublished; no near-match or estimated quantity is substituted.',
  },
  summary,
  records,
};

writeFileSync(new URL('CONTENT_AUDIT.json', root), `${JSON.stringify(audit, null, 2)}\n`);
console.log(`Wrote one audit disposition for each of ${records.length} archive entries.`);
