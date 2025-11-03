
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';
export type Gender = 'm' | 'f' | 'n' | 'invalid';
export type Region = 'LATAM' | 'SPAIN';
export type TagType = 'VULGAR' | 'REFLEXIVE' | 'GENDER-SPECIFIC';

export type Tense = 'present' | 'preterite' | 'imperfect';
export type Mood = 'indicative' | 'subjunctive';

export type PronounConjugation = {
  yo: string;
  tu: string;
  el: string;
  nosotros: string;
  vosotros: string;
  ellos: string;
};

export interface SpanishSide {
  word: string;
  pos: PartOfSpeech;
  as_in: string;
  region?: Region;
  reflexive?: boolean;
  gender_map?: { [key: string]: Gender };
  conjugations?: Partial<Record<Mood, Partial<Record<Tense, PronounConjugation>>>>;
  tags?: TagType[];
}

export interface EnglishSide {
  word: string;
  pos: PartOfSpeech;
  as_in: string;
}

export interface Meaning {
  spanish: SpanishSide;
  english: EnglishSide;
  note?: string;
}

export interface DictionaryEntry {
  id: string;
  starred: boolean;
  meanings: Meaning[];
  related_spanish: string[];
  related_english: string[];
}

export type AppMode = 'title' | 'dictionary' | 'importList';
export type ModalType = 'listInfo' | 'lockList' | 'unlockList' | 'removeListConfirmation';
