import raw from './historical-formulas.json';
import type { HistoricalFormula } from '@/types';

export const historicalFormulas = raw as unknown as HistoricalFormula[];

const formulasByEntryId = new Map(historicalFormulas.map((formula) => [formula.entry_id, formula]));

export function getHistoricalFormula(entryId: string): HistoricalFormula | undefined {
  return formulasByEntryId.get(entryId);
}
