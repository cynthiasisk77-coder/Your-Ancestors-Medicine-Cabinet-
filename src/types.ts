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

export type Entry = {
  id: string;
  name: string;
  sci: string | null;
  people: string;
  community: Community;
  region: Region;
  use: string;
  method: string | null;
  note: string | null;
  caution: string | null;
  confirmed: boolean;
  img: EntryImage | null;
};
