
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'interjection';
export type Gender = 'm' | 'f' | 'n' | 'invalid';
export type Region = 'LATAM' | 'SPAIN';

export type VisibleTag =
  | 'GS'
  | 'COLLOQUIAL'
  | 'VULGAR'
  | 'IMPERSONAL'
  | 'REFL'
  | 'article_m_override'
  | 'plural_only'
  | 'singular_only'
  | 'unisex'
  | 'indeclinable';

export type SimpleInvisibleTag =
  | 'e>ie'
  | 'o>ue'
  | 'u>ue'
  | 'e>i'
  | 'i>ie'
  | 'slip_e>i'
  | 'slip_o>u'
  | 'go'
  | 'zco'
  | 'jo'
  | 'igo'
  | 'c>qu'
  | 'g>gu'
  | 'z>c'
  | 'gu>g'
  | 'g>j'
  | 'defective=3rd_only'
  | 'aux=haber'
  | 'enclitic_ok';

export type IrregularInvisibleTag = `irreg(${string})=${string}`;
export type InvisibleTag = SimpleInvisibleTag | IrregularInvisibleTag;

export interface MeaningTags {
  visible?: VisibleTag[];
  invisible?: InvisibleTag[];
  region?: Region | null;
}

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
  display_word?: string;
  aliases?: string[];
  note?: string;
  gender_map?: { [key: string]: Gender };
}

export interface EnglishSide {
  word: string;
  note?: string;
}

export interface Meaning {
  pos: PartOfSpeech;
  as_in: string;
  spanish: SpanishSide;
  english: EnglishSide;
  tags?: MeaningTags;
  trailing_words?: string[];
}

export interface DictionaryEntry {
  id: string;
  starred: boolean;
  meanings: Meaning[];
  related_spanish: string[];
  related_english: string[];
  connected?: string[];
  grand_note?: { title: string; description: string };
}

export type CustomListPayload = {
    name: string;
    pairs: { spanish: string; english: string }[];
    password?: string;
    showVulgar?: boolean;
};

export type AppMode = 'title' | 'dictionary' | 'listBuilder' | 'viewWords' | 'vocabPractice' | 'entryTester';
export type ModalType = 'listStatus';