import { ConjugationMap, FullConjugationObject, Mood, Pronoun, PronounConjugation, Tense } from '../types';

const PRONOUNS: Pronoun[] = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
const MOODS: Mood[] = ['indicative', 'subjunctive'];
const TENSES: Tense[] = ['present', 'preterite', 'imperfect'];

type ConjugationEndings = {
  [M in Mood]: {
    [T in Tense]: {
      ar: PronounConjugation;
      er: PronounConjugation;
      ir: PronounConjugation;
    };
  };
};

const REGULAR_ENDINGS: ConjugationEndings = {
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

const removeAccents = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const stripReflexive = (infinitive: string): string => {
  const trimmed = infinitive.trim().toLowerCase();
  return trimmed.endsWith('se') ? trimmed.slice(0, -2) : trimmed;
};

const getVerbInfo = (infinitive: string): { stem: string; type: 'ar' | 'er' | 'ir' } => {
  const cleanInfinitive = stripReflexive(infinitive);
  const ending = cleanInfinitive.slice(-2);
  const normalizedEnding = removeAccents(ending) as 'ar' | 'er' | 'ir';

  if (normalizedEnding !== 'ar' && normalizedEnding !== 'er' && normalizedEnding !== 'ir') {
    return {
      stem: cleanInfinitive.slice(0, Math.max(0, cleanInfinitive.length - 2)),
      type: 'ar'
    };
  }

  return {
    stem: cleanInfinitive.slice(0, -2),
    type: normalizedEnding
  };
};

const applyTemplate = (template: string, ending: string, fallback: string): string => {
  if (!template) {
    return fallback;
  }

  if (template.includes('X')) {
    return template.replace(/X/g, ending);
  }

  return template;
};

export function getFullConjugation(infinitive: string, conjMap: ConjugationMap = {}): FullConjugationObject {
  const { stem, type } = getVerbInfo(infinitive);
  const result = {} as FullConjugationObject;

  MOODS.forEach((mood) => {
    result[mood] = {} as Record<Tense, PronounConjugation>;

    TENSES.forEach((tense) => {
      const endings = REGULAR_ENDINGS[mood][tense][type];
      const rule = conjMap?.[mood]?.[tense];

      const forms = PRONOUNS.reduce((acc, pronoun) => {
        const baseEnding = endings[pronoun];
        const regularForm = `${stem}${baseEnding}`;

        if (rule?.exceptions?.[pronoun]) {
          acc[pronoun] = rule.exceptions[pronoun] as string;
          return acc;
        }

        if (rule?.general) {
          acc[pronoun] = applyTemplate(rule.general, baseEnding, regularForm);
          return acc;
        }

        acc[pronoun] = regularForm;
        return acc;
      }, {} as PronounConjugation);

      result[mood][tense] = forms;
    });
  });

  return result;
}
