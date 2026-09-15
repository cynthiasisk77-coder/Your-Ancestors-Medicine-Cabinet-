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

// 2-letter USPS state code (e.g. "TX"), or null when a single state can't be
// honestly determined for this entry (the underlying tradition spans several
// states, or nothing ties it to one place in particular).
export type StateCode = string;

export type Entry = {
  id: string;
  name: string;
  sci: string | null;
  people: string;
  community: Community;
  region: Region;
  state: StateCode | null;
  use: string;
  method: string | null;
  note: string | null;
  caution: string | null;
  confirmed: boolean;
  img: EntryImage | null;
};
