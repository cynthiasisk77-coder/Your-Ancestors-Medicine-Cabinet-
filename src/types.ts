export type Community =
  | 'native'
  | 'english'
  | 'pagerman'
  | 'spanish'
  | 'appalachian'
  | 'creole'
  | 'mexican'
  | 'african'
  | 'irish'
  | 'italian'
  | 'jewish'
  | 'scandinavian'
  | 'chinese'
  | 'japanese'
  | 'volga-german'
  | 'filipino'
  | 'portuguese'
  | 'french-canadian'
  | 'polish'
  | 'czech-slovak'
  | 'ukrainian';

export type Region =
  | 'northeast'
  | 'midatlantic'
  | 'southeast'
  | 'greatlakes'
  | 'plains'
  | 'southwest'
  | 'west'
  | 'alaska'
  | 'hawaii';

export type EntryImage = { type: 'asset'; value: string };

export type PhotoCredit = {
  filename: string;
  label: string;
  license: string;
  license_url: string;
  creator: string;
  credit: string;
  source_page: string;
  original_url: string;
  verification_status: 'verified_from_wikimedia_manifest' | 'unverified_source_retained';
  notes: string;
};

// Historical-use locations retained from the original archive. These are not
// botanical ranges; the States tab uses the separately sourced USDA range data.
export type StateCode = string;

export type Entry = {
  id: string;
  name: string;
  sci: string | null;
  people: string;
  community: Community;
  region: Region;
  state: StateCode[];
  use: string;
  method: string | null;
  note: string | null;
  caution: string | null;
  confirmed: boolean;
  img: EntryImage | null;
};
