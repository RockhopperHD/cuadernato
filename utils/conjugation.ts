import { MeaningTags, Mood, PartOfSpeech, PronounConjugation, SpanishSide, Tense } from '../types';

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

const splitReflexive = (value: string) => {
  const match = value.match(/^(\(\(\(.*?\)\)\)\s+)/);
  if (match) {
    return { prefix: match[0], core: value.slice(match[0].length) };
  }
  return { prefix: '', core: value };
};

const removeDiacritics = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '');
const ACCENT_CHAR_PATTERN = /[áéíóúÁÉÍÓÚñÑüÜ]/g;

const highlightIrregularValue = (base: string, irregular: string) => {
  if (!irregular) {
    return irregular;
  }

  if (base) {
    const basePlain = removeDiacritics(base);
    const irregularPlain = removeDiacritics(irregular);

    if (basePlain === irregularPlain) {
      const accentOnly = irregular.replace(ACCENT_CHAR_PATTERN, match => `(${match})`);
      if (accentOnly !== irregular) {
        return accentOnly;
      }
    }
  }

  return `(${irregular})`;
};

type ConjugationTable = Partial<Record<Mood, Partial<Record<Tense, PronounConjugation>>>>;

const buildBaseConjugations = (
  spanish: SpanishSide,
  pos: PartOfSpeech
): { details: ReturnType<typeof getVerbBase>; forms: ConjugationTable } => {
  if (pos !== 'verb') {
    return { details: null, forms: {} };
  }

  const details = getVerbBase(spanish.word);
  if (!details) {
    return { details: null, forms: {} };
  }

  const { stem, ending, reflexive } = details;

  const result: ConjugationTable = {};

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

  return { details, forms: result };
};

const cloneConjugations = (input: ConjugationTable): ConjugationTable => {
  const clone: ConjugationTable = {};
  (Object.keys(input) as Mood[]).forEach((mood) => {
    const moodBlock = input[mood];
    if (!moodBlock) return;
    clone[mood] = {};
    (Object.keys(moodBlock) as Tense[]).forEach((tense) => {
      const tenseBlock = moodBlock[tense];
      if (!tenseBlock) return;
      clone[mood]![tense] = { ...tenseBlock };
    });
  });
  return clone;
};

const replaceStemSegment = (
  current: string,
  ending: string,
  from: string,
  to: string,
  highlight: 'stem' | 'irregular'
): string | null => {
  if (!current.endsWith(ending)) {
    return null;
  }
  const stem = current.slice(0, current.length - ending.length);
  const index = stem.lastIndexOf(from);
  if (index === -1) {
    return null;
  }
  const replacement = highlight === 'stem' ? `((${to}))` : `(${to})`;
  return stem.slice(0, index) + replacement + stem.slice(index + from.length) + ending;
};

const normalizeFirstLetter = (ending: string) =>
  ending.charAt(0).normalize('NFD').replace(/[^a-z]/gi, '').toLowerCase();

const endsWithEnding = (
  mood: Mood,
  tense: Tense,
  pronoun: keyof PronounConjugation,
  verbEnding: 'ar' | 'er' | 'ir'
) => CONJUGATION_ENDINGS[mood]?.[tense]?.[verbEnding]?.[pronoun] ?? '';

const applyStemChange = (
  forms: ConjugationTable,
  verbEnding: 'ar' | 'er' | 'ir',
  tag: string
) => {
  const [from, to] = tag.split('>');
  if (!from || !to) return;
  const targets: { mood: Mood; tense: Tense }[] = [
    { mood: 'indicative', tense: 'present' },
    { mood: 'subjunctive', tense: 'present' },
  ];
  const affectedPronouns: (keyof PronounConjugation)[] = ['yo', 'tu', 'el', 'ellos'];

  targets.forEach(({ mood, tense }) => {
    const block = forms[mood]?.[tense];
    if (!block) return;
    affectedPronouns.forEach((pronoun) => {
      const form = block[pronoun];
      if (!form) return;
      const { prefix, core } = splitReflexive(form);
      const ending = endsWithEnding(mood, tense, pronoun, verbEnding);
      const updated = replaceStemSegment(core, ending, from, to, 'stem');
      if (!updated) return;
      block[pronoun] = `${prefix}${updated}`;
    });
  });
};

const applySlipChange = (
  forms: ConjugationTable,
  verbEnding: 'ar' | 'er' | 'ir',
  tag: string
) => {
  const [from, to] = tag.replace('slip_', '').split('>');
  if (!from || !to) return;
  const block = forms.indicative?.preterite;
  if (!block) return;
  ['el', 'ellos'].forEach((pronoun) => {
    const form = block[pronoun as keyof PronounConjugation];
    if (!form) return;
    const { prefix, core } = splitReflexive(form);
    const ending = endsWithEnding('indicative', 'preterite', pronoun as keyof PronounConjugation, verbEnding);
    const updated = replaceStemSegment(core, ending, from, to, 'stem');
    if (!updated) return;
    block[pronoun as keyof PronounConjugation] = `${prefix}${updated}`;
  });
};

const applyYoTag = (forms: ConjugationTable, tag: string) => {
  const block = forms.indicative?.present;
  if (!block) return;
  const form = block.yo;
  if (!form) return;
  const { prefix, core } = splitReflexive(form);
  let updated: string | null = null;

  const withRed = (value: string) => `(${value})`;

  if (tag === 'go' && core.endsWith('o')) {
    updated = `${core.slice(0, -1)}${withRed('go')}`;
  } else if (tag === 'zco' && core.endsWith('co')) {
    updated = `${core.slice(0, -2)}${withRed('zco')}`;
  } else if (tag === 'jo' && core.endsWith('go')) {
    updated = `${core.slice(0, -2)}${withRed('jo')}`;
  } else if (tag === 'igo') {
    if (core.endsWith('eo') || core.endsWith('ío')) {
      updated = `${core.slice(0, -2)}${withRed('igo')}`;
    } else if (core.endsWith('co')) {
      updated = `${core.slice(0, -2)}${withRed('go')}`;
    } else if (core.endsWith('o')) {
      updated = `${core.slice(0, -1)}${withRed('igo')}`;
    }
  }

  if (updated) {
    block.yo = `${prefix}${updated}`;
  }
};

const ORTHO_RULES: Record<
  string,
  {
    match: string;
    replace: string;
    highlight: 'irregular' | 'stem';
    condition: 'beforeE' | 'beforeA';
    affectPreteriteYo?: boolean;
  }
> = {
  'c>qu': { match: 'c', replace: 'qu', highlight: 'irregular', condition: 'beforeE', affectPreteriteYo: true },
  'g>gu': { match: 'g', replace: 'gu', highlight: 'irregular', condition: 'beforeE', affectPreteriteYo: true },
  'z>c': { match: 'z', replace: 'c', highlight: 'irregular', condition: 'beforeE', affectPreteriteYo: true },
  'gu>g': { match: 'gu', replace: 'g', highlight: 'irregular', condition: 'beforeA' },
  'g>j': { match: 'g', replace: 'j', highlight: 'irregular', condition: 'beforeA' },
};

const shouldApplyOrthChange = (ending: string, condition: 'beforeE' | 'beforeA') => {
  const letter = normalizeFirstLetter(ending);
  if (condition === 'beforeE') {
    return letter === 'e' || letter === 'i';
  }
  return letter === 'a' || letter === 'o';
};

const applyOrthographicTag = (
  forms: ConjugationTable,
  verbEnding: 'ar' | 'er' | 'ir',
  tag: string
) => {
  const config = ORTHO_RULES[tag];
  if (!config) return;

  const applyTo = (mood: Mood, tense: Tense, pronouns: (keyof PronounConjugation)[]) => {
    const block = forms[mood]?.[tense];
    if (!block) return;
    pronouns.forEach((pronoun) => {
      const form = block[pronoun];
      if (!form) return;
      const ending = endsWithEnding(mood, tense, pronoun, verbEnding);
      if (!ending || !shouldApplyOrthChange(ending, config.condition)) {
        return;
      }
      const { prefix, core } = splitReflexive(form);
      const updated = replaceStemSegment(core, ending, config.match, config.replace, config.highlight);
      if (!updated) return;
      block[pronoun] = `${prefix}${updated}`;
    });
  };

  applyTo('subjunctive', 'present', PRONOUNS);
  if (config.affectPreteriteYo) {
    applyTo('indicative', 'preterite', ['yo']);
  }
};

type IrregularOverride =
  | { kind: 'conjugation'; mood: Mood; tense: Tense; pronoun?: keyof PronounConjugation; value: string }
  | { kind: 'special'; form: string; value: string };

const IRREGULAR_SCOPE_MAP: Record<string, { mood: Mood; tense: Tense } | null> = {
  ind_pres: { mood: 'indicative', tense: 'present' },
  pr_ind: { mood: 'indicative', tense: 'present' },
  ind_pret: { mood: 'indicative', tense: 'preterite' },
  ind_impf: { mood: 'indicative', tense: 'imperfect' },
  pr_sbj: { mood: 'subjunctive', tense: 'present' },
  subj_pres: { mood: 'subjunctive', tense: 'present' },
  subj_impf: { mood: 'subjunctive', tense: 'imperfect' },
};

const normalizePronoun = (raw?: string): keyof PronounConjugation | undefined => {
  if (!raw) return undefined;
  const normalized = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z]/g, '');
  if (['yo', 'tu'].includes(normalized)) return normalized as 'yo' | 'tu';
  if (['el', 'ella', 'ud', 'usted'].includes(normalized)) return 'el';
  if (['ellos', 'ellas', 'uds', 'ustedes'].includes(normalized)) return 'ellos';
  if (normalized === 'nosotros') return 'nosotros';
  if (normalized === 'vosotros' || normalized === 'vos') return 'vosotros';
  return undefined;
};

const parseIrregularTag = (tag: string): IrregularOverride | null => {
  const match = tag.match(/^irreg\(([^,)]+)(?:,\s*([^)=]+))?\)=(.+)$/);
  if (!match) return null;
  const [, scopeRaw, pronRaw, valueRaw] = match;
  const scope = scopeRaw.trim();
  const normalizedScope = IRREGULAR_SCOPE_MAP[scope];
  const value = valueRaw.trim();
  if (!normalizedScope) {
    return { kind: 'special', form: scope, value };
  }
  return {
    kind: 'conjugation',
    mood: normalizedScope.mood,
    tense: normalizedScope.tense,
    pronoun: normalizePronoun(pronRaw?.trim()),
    value,
  };
};

const applyIrregularOverrides = (
  forms: ConjugationTable,
  overrides: IrregularOverride[]
) => {
  overrides.forEach((override) => {
    if (override.kind !== 'conjugation') {
      return;
    }
    const block = forms[override.mood]?.[override.tense];
    if (!block) return;
    const targets = override.pronoun ? [override.pronoun] : PRONOUNS;
    targets.forEach((pronoun) => {
      const form = block[pronoun];
      if (!form) return;
      const { prefix, core } = splitReflexive(form);
      const highlighted = highlightIrregularValue(core, override.value);
      block[pronoun] = `${prefix}${highlighted}`;
    });
  });
};

const applyDefectiveTag = (forms: ConjugationTable) => {
  const blocked: (keyof PronounConjugation)[] = ['yo', 'tu', 'nosotros', 'vosotros'];
  (Object.keys(forms) as Mood[]).forEach((mood) => {
    const moodBlock = forms[mood];
    if (!moodBlock) return;
    (Object.keys(moodBlock) as Tense[]).forEach((tense) => {
      const tenseBlock = moodBlock[tense];
      if (!tenseBlock) return;
      blocked.forEach((pronoun) => {
        if (tenseBlock[pronoun]) {
          tenseBlock[pronoun] = '✕';
        }
      });
    });
  });
};

export const generateConjugations = (
  spanish: SpanishSide,
  pos: PartOfSpeech,
  tags?: MeaningTags
): ConjugationTable => {
  const { details, forms: baseForms } = buildBaseConjugations(spanish, pos);
  if (!details) {
    return baseForms;
  }

  const working = cloneConjugations(baseForms);
  const invisibleTags = tags?.invisible ?? [];

  invisibleTags.forEach((tag) => {
    if (['e>ie', 'o>ue', 'u>ue', 'e>i', 'i>ie'].includes(tag)) {
      applyStemChange(working, details.ending, tag);
    } else if (tag === 'slip_e>i' || tag === 'slip_o>u') {
      applySlipChange(working, details.ending, tag);
    } else if (['go', 'zco', 'jo', 'igo'].includes(tag)) {
      applyYoTag(working, tag);
    } else if (tag in ORTHO_RULES) {
      applyOrthographicTag(working, details.ending, tag);
    } else if (tag === 'defective=3rd_only') {
      applyDefectiveTag(working);
    }
  });

  const irregularOverrides = invisibleTags
    .map(parseIrregularTag)
    .filter((override): override is IrregularOverride => Boolean(override));

  if (irregularOverrides.length > 0) {
    applyIrregularOverrides(working, irregularOverrides);
  }

  return working;
};

