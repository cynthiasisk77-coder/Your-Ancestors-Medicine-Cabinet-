import raw from './plant-state-ranges.json';

export type PlantStateRange = {
  states: string[];
  scientific_names: string[];
  source_profiles: string[];
};

type PlantStateRangeData = {
  metadata: {
    source: string;
    source_url: string;
    downloads_url: string;
    retrieved: string;
    method: string;
    caveat: string;
  };
  ranges: Record<string, PlantStateRange>;
};

export const plantStateRangeData = raw as PlantStateRangeData;
export const plantStateRanges = plantStateRangeData.ranges;

export function getPlantStateRange(entryId: string) {
  return plantStateRanges[entryId];
}
