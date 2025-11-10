export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';
export type Gender = 'm' | 'f' | 'n' | 'invalid';
export type Region = 'LATAM' | 'SPAIN';
export type TagType = 'VULGAR' | 'REFLEXIVE' | 'GENDER-SPECIFIC' | 'COLLOQUIAL';

export type Mood = 'indicative' | 'subjunctive';
export type Tense = 'present' | 'preterite' | 'imperfect';
export type Pronoun = 'yo' | 'tu' | 'el' | 'nosotros' | 'vosotros' | 'ellos';

export type PronounConjugation = Record<Pronoun, string>;
export type FullConjugationObject = Record<Mood, Record<Tense, PronounConjugation>>;

export interface CommandException {
  type: string;
  pronoun: string;
  word: string;
}

export interface TenseConjugation {
  general?: string;
  exceptions?: Partial<Record<Pronoun, string>>;
}

export type ConjugationMap = Partial<Record<Mood, Partial<Record<Tense, TenseConjugation>>>>;

export interface IntelligentSpanishSide {
  word: string;
  note?: string;
  region?: Region;
  tags?: TagType[];
  gender_map?: { [key: string]: Gender };
  conj_map?: ConjugationMap;
  exceptions?: CommandException[];
}

export interface EnglishSide {
  word: string;
}

export interface IntelligentMeaning {
  pos: PartOfSpeech;
  as_in: string;
  spanish: IntelligentSpanishSide;
  english: EnglishSide;
  note?: string;
}

export interface IntelligentDictionaryEntry {
  id: string;
  starred: boolean;
  grand_note?: {
    title: string;
    description: string;
  };
  meanings: IntelligentMeaning[];
  related_spanish?: string[];
  related_english?: string[];
  trailing_spanish?: string[];
}

export type DictionaryEntry = IntelligentDictionaryEntry;
export type Meaning = IntelligentMeaning;
export type SpanishSide = IntelligentSpanishSide;

export type CustomListPayload = {
    name: string;
    pairs: { spanish: string; english: string }[];
    password?: string;
    showVulgar?: boolean;
};

export type AppMode = 'title' | 'dictionary' | 'listBuilder' | 'viewWords' | 'vocabPractice';
export type ModalType = 'listStatus';
