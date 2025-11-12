import { Mood, PartOfSpeech, PronounConjugation, SpanishSide, Tense } from '../types';

const PRONOUNS: (keyof PronounConjugation)[] = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];

type ConjugationEndings = {
  [M in Mood]: {
    [T in Tense]?: {
      ar: PronounConjugation;
      er: PronounConjugation;
      ir: PronounConjugation;
    };
  };
};

const CONJUGATION_ENDINGS: ConjugationEndings = {
  indicative: {
    present: {
      ar: { yo: 'o', tu: 'as', el: 'a', nosotros: 'amos', vosotros: 'áis', ellos: 'an' },
      er: { yo: 'o', tu: 'es', el: 'e', nosotros: 'emos', vosotros: 'éis', ellos: 'en' },
      ir: { yo: 'o', tu: 'es', el: 'e', nosotros: 'imos', vosotros: 'ís', ellos: 'en' }
    },
    preterite: {
      ar: { yo: 'é', tu: 'aste', el: 'ó', nosotros: 'amos', vosotros: 'asteis', ellos: 'aron' },
      er: { yo: 'í', tu: 'iste', el: 'ió', nosotros: 'imos', vosotros: 'isteis', ellos: 'ieron' },
      ir: { yo: 'í', tu: 'iste', el: 'ió', nosotros: 'imos', vosotros: 'isteis', ellos: 'ieron' }
    },
    imperfect: {
      ar: { yo: 'aba', tu: 'abas', el: 'aba', nosotros: 'ábamos', vosotros: 'abais', ellos: 'aban' },
      er: { yo: 'ía', tu: 'ías', el: 'ía', nosotros: 'íamos', vosotros: 'íais', ellos: 'ían' },
      ir: { yo: 'ía', tu: 'ías', el: 'ía', nosotros: 'íamos', vosotros: 'íais', ellos: 'ían' }
    }
  },
  subjunctive: {
    present: {
      ar: { yo: 'e', tu: 'es', el: 'e', nosotros: 'emos', vosotros: 'éis', ellos: 'en' },
      er: { yo: 'a', tu: 'as', el: 'a', nosotros: 'amos', vosotros: 'áis', ellos: 'an' },
      ir: { yo: 'a', tu: 'as', el: 'a', nosotros: 'amos', vosotros: 'áis', ellos: 'an' }
    },
    imperfect: {
      ar: { yo: 'ara', tu: 'aras', el: 'ara', nosotros: 'áramos', vosotros: 'arais', ellos: 'aran' },
      er: { yo: 'iera', tu: 'ieras', el: 'iera', nosotros: 'iéramos', vosotros: 'ierais', ellos: 'ieran' },
      ir: { yo: 'iera', tu: 'ieras', el: 'iera', nosotros: 'iéramos', vosotros: 'ierais', ellos: 'ieran' }
    }
  }
};

const REFLEXIVE_PRONOUNS: Record<keyof PronounConjugation, string> = {
  yo: '(((me)))',
  tu: '(((te)))',
  el: '(((se)))',
  nosotros: '(((nos)))',
  vosotros: '(((os)))',
  ellos: '(((se)))'
};

const sanitizeVerb = (word: string): string => word.trim().toLowerCase();

const getVerbBase = (word: string) => {
  const clean = sanitizeVerb(word);
  const reflexive = clean.endsWith('se');
  const infinitive = reflexive ? clean.slice(0, -2) : clean;
  const ending = infinitive.slice(-2);
  const stem = infinitive.slice(0, -2);

  if (!['ar', 'er', 'ir'].includes(ending)) {
    return null;
  }

  return { stem, ending: ending as 'ar' | 'er' | 'ir', reflexive };
};

const buildForm = (stem: string, ending: string, pronoun: keyof PronounConjugation, reflexive: boolean) => {
  const base = `${stem}${ending}`;
  if (!reflexive) {
    return base;
  }
  return `${REFLEXIVE_PRONOUNS[pronoun]} ${base}`;
};

export const generateConjugations = (
  spanish: SpanishSide,
  pos: PartOfSpeech
): Partial<Record<Mood, Partial<Record<Tense, PronounConjugation>>>> => {
  if (pos !== 'verb') {
    return {};
  }

  const details = getVerbBase(spanish.word);
  if (!details) {
    return {};
  }

  const { stem, ending, reflexive } = details;

  const result: Partial<Record<Mood, Partial<Record<Tense, PronounConjugation>>>> = {};

  (Object.keys(CONJUGATION_ENDINGS) as Mood[]).forEach((mood) => {
    const moodEndings = CONJUGATION_ENDINGS[mood];
    const tenses = Object.keys(moodEndings) as Tense[];
    tenses.forEach((tense) => {
      const tenseEndings = moodEndings[tense];
      if (!tenseEndings) return;
      const pronounEndings = tenseEndings[ending];
      const forms: PronounConjugation = PRONOUNS.reduce((acc, pronoun) => {
        acc[pronoun] = buildForm(stem, pronounEndings[pronoun], pronoun, reflexive);
        return acc;
      }, {} as PronounConjugation);

      if (!result[mood]) {
        result[mood] = {};
      }
      result[mood]![tense] = forms;
    });
  });

  return result;
};

export const mergeConjugations = (
  base: Partial<Record<Mood, Partial<Record<Tense, PronounConjugation>>>>,
  overrides?: Partial<Record<Mood, Partial<Record<Tense, Partial<PronounConjugation>>>>> 
): Partial<Record<Mood, Partial<Record<Tense, PronounConjugation>>>> => {
  if (!overrides) {
    return base;
  }

  const merged: Partial<Record<Mood, Partial<Record<Tense, PronounConjugation>>>> = {};

  const moods = new Set<Mood>([
    ...(Object.keys(base) as Mood[]),
    ...(Object.keys(overrides) as Mood[])
  ]);

  moods.forEach((mood) => {
    const baseMood = base[mood] ?? {};
    const overrideMood = overrides[mood] ?? {};
    const tenses = new Set<Tense>([
      ...(Object.keys(baseMood) as Tense[]),
      ...(Object.keys(overrideMood) as Tense[])
    ]);

    tenses.forEach((tense) => {
      const baseTense = baseMood[tense];
      const overrideTense = overrideMood[tense];
      if (!baseTense && !overrideTense) {
        return;
      }

      const mergedTense: PronounConjugation = PRONOUNS.reduce((acc, pronoun) => {
        const overrideForm = overrideTense?.[pronoun];
        const baseForm = baseTense?.[pronoun];
        acc[pronoun] = overrideForm ?? baseForm ?? '—';
        return acc;
      }, {} as PronounConjugation);

      if (!merged[mood]) {
        merged[mood] = {};
      }
      merged[mood]![tense] = mergedTense;
    });
  });

  return merged;
};

