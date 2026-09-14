import type { Community, Region } from '@/types';

export const communityLabels: Record<Community, string> = {
  native: 'Native Nations',
  english: 'English & New England',
  pagerman: 'Pennsylvania German',
  spanish: 'Spanish Colonial',
  appalachian: 'Appalachian & Ozark',
  creole: 'Louisiana Creole',
  mexican: 'Mexican-American',
  african: 'African American',
  irish: 'Irish-American',
  italian: 'Italian-American',
  jewish: 'Jewish-American',
  scandinavian: 'Scandinavian-American',
  chinese: 'Chinese-American',
  japanese: 'Japanese-American',
  'volga-german': 'Volga German-American',
  filipino: 'Filipino-American',
  portuguese: 'Portuguese & Azorean-American',
  'french-canadian': 'French-Canadian-American',
  polish: 'Polish-American',
  'czech-slovak': 'Czech & Slovak-American',
  ukrainian: 'Ukrainian, Rusyn & Lithuanian-American',
};

export const regionLabels: Record<Region, string> = {
  northeast: 'Northeast',
  midatlantic: 'Mid-Atlantic',
  southeast: 'Southeast',
  greatlakes: 'Great Lakes',
  plains: 'Great Plains',
  southwest: 'Southwest',
  west: 'California & West',
  alaska: 'Alaska & the Far North',
  hawaii: "Hawai'i",
};

// Rough grid position for each region, used for the simple visual region map
// on the Regions tab (columns 0-4 left-to-right, rows 0-3 top-to-bottom).
export const regionGridPosition: Record<Region, { row: number; col: number }> = {
  alaska: { row: 0, col: 0 },
  greatlakes: { row: 1, col: 2 },
  northeast: { row: 1, col: 4 },
  midatlantic: { row: 2, col: 4 },
  plains: { row: 2, col: 2 },
  west: { row: 2, col: 0 },
  southwest: { row: 3, col: 1 },
  southeast: { row: 3, col: 3 },
  hawaii: { row: 3, col: 0 },
};

export const communityOrder = Object.keys(communityLabels) as Community[];
export const regionOrder = Object.keys(regionLabels) as Region[];
