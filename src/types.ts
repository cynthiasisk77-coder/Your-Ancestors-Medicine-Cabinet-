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

// 2-letter USPS state code (e.g. "TX"). An entry can genuinely belong to more
// than one state (a tradition documented across several named states) - the
// array holds every state actually named for this entry, or is empty when
// none can be honestly pinned down.
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
