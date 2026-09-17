import { readFileSync } from 'node:fs';

const entries = JSON.parse(readFileSync(new URL('../src/data/entries.json', import.meta.url), 'utf8'));
const formulas = JSON.parse(readFileSync(new URL('../src/data/historical-formulas.json', import.meta.url), 'utf8'));

const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
const formulaIds = new Set();
const entryIds = new Set();
const blockedIngredientPattern = /\b(?:arsenic|belladonna|castor bean|coontie|cycad|datura|death camas|foxglove|hemlock|jimsonweed|kerosene|lead|lye|mercury|nightshade|opium|pennyroyal|pokeweed|strychnine|tobacco|turpentine|water hemlock|yew)\b/i;

for (const formula of formulas) {
  if (formulaIds.has(formula.id)) throw new Error(`Duplicate formula id: ${formula.id}`);
  if (entryIds.has(formula.entry_id)) throw new Error(`More than one formula for entry: ${formula.entry_id}`);
  formulaIds.add(formula.id);
  entryIds.add(formula.entry_id);

  const entry = entriesById.get(formula.entry_id);
  if (!entry) throw new Error(`Formula points to a missing entry: ${formula.entry_id}`);
  if (entry.caution) throw new Error(`Formula is attached to a cautioned entry: ${formula.entry_id}`);
  if (formula.verification_status !== 'verified_primary_source') {
    throw new Error(`Formula is not primary-source verified: ${formula.id}`);
  }
  if (!Array.isArray(formula.ingredients) || formula.ingredients.length < 2) {
    throw new Error(`Formula needs at least two measured ingredients: ${formula.id}`);
  }
  const screeningText = [
    entry.name,
    entry.sci,
    entry.use,
    entry.method,
    entry.note,
    entry.caution,
    formula.title,
    ...formula.ingredients.map((ingredient) => ingredient.item),
    ...formula.recorded_method,
  ].filter(Boolean).join(' ');
  if (blockedIngredientPattern.test(screeningText)) {
    throw new Error(`Blocked hazardous term in formula or linked archive entry: ${formula.id}`);
  }
  for (const ingredient of formula.ingredients) {
    if (!/\d|[¼½¾⅓⅔]/u.test(ingredient.amount)) {
      throw new Error(`Ingredient lacks a measured amount in ${formula.id}: ${ingredient.item}`);
    }
  }
  if (!Array.isArray(formula.recorded_method) || formula.recorded_method.length < 2) {
    throw new Error(`Formula needs a complete recorded method: ${formula.id}`);
  }
  if (!formula.source_fit || !formula.archive_note || !Array.isArray(formula.safety_notes) || formula.safety_notes.length < 2) {
    throw new Error(`Formula is missing verification or safety context: ${formula.id}`);
  }
  if (!formula.primary_source?.url?.startsWith('https://')) {
    throw new Error(`Formula needs an HTTPS primary-source link: ${formula.id}`);
  }
  if (!Array.isArray(formula.safety_sources) || formula.safety_sources.length === 0) {
    throw new Error(`Formula needs at least one modern safety source: ${formula.id}`);
  }
  for (const source of formula.safety_sources) {
    if (!source.url?.startsWith('https://')) throw new Error(`Unsafe safety-source URL in ${formula.id}`);
  }
}

console.log(`Validated ${formulas.length} primary-source historical formulas against ${entries.length} archive entries.`);
