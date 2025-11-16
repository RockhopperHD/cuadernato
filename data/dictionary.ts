import { DictionaryEntry } from '../types';

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    id: '000001',
    starred: false,
    grand_note: {
      title: 'Gender with Animals',
      description: 'When pato refers to the bird, swapping -o for -a changes the animal entirely.',
    },
    meanings: [
      {
        pos: 'noun',
        as_in: 'the duck',
        spanish: {
          word: 'pato',
          gender_map: {
            pato: 'm',
            pata: 'f',
          },
        },
        english: {
          word: 'duck',
        },
        tags: {
          visible: ['GS'],
        },
        trailing_words: ['pato salvaje'],
      },
    ],
    related_spanish: ['pata'],
    related_english: ['duckling'],
  },
  {
    id: '000002',
    starred: false,
    meanings: [
      {
        pos: 'noun',
        as_in: 'of an animal',
        spanish: {
          word: 'pata',
          gender_map: {
            pata: 'f',
          },
        },
        english: {
          word: 'paw',
        },
      },
    ],
    related_spanish: ['pato'],
    related_english: [],
  },
  {
    id: '000003',
    starred: false,
    meanings: [
      {
        pos: 'noun',
        as_in: 'vulgar feces',
        spanish: {
          word: 'mierda',
          note: 'Extremely informal and often offensive.',
          gender_map: {
            mierda: 'f',
          },
        },
        english: {
          word: 'shit',
        },
        tags: {
          visible: ['VULGAR'],
        },
      },
    ],
    related_spanish: [],
    related_english: [],
  },
  {
    id: '000004',
    starred: true,
    meanings: [
      {
        pos: 'noun',
        as_in: 'drinking water',
        spanish: {
          word: 'agua',
          note: 'Takes the masculine article “el” in the singular to avoid a double “a” sound.',
          gender_map: {
            agua: 'f',
          },
        },
        english: {
          word: 'water',
        },
        tags: {
          visible: ['article_m_override', 'singular_only'],
        },
      },
    ],
    related_spanish: [],
    related_english: [],
  },
  {
    id: '000005',
    starred: true,
    meanings: [
      {
        pos: 'verb',
        as_in: 'to possess something',
        spanish: {
          word: 'tener',
          note: 'Used for age, obligations with “tener que”, and many idioms.',
        },
        english: {
          word: 'to have',
          note: 'Covers possession and idioms such as “to have to”.',
        },
        tags: {
          visible: [],
          invisible: [
            'go',
            'e>ie',
            'irreg(ind_pret, yo)=tuve',
            'irreg(ind_pret, tu)=tuviste',
            'irreg(ind_pret, el)=tuvo',
            'irreg(ind_pret, nosotros)=tuvimos',
            'irreg(ind_pret, vosotros)=tuvisteis',
            'irreg(ind_pret, ellos)=tuvieron',
            'irreg(subj_pres, yo)=tenga',
            'irreg(subj_pres, tu)=tengas',
            'irreg(subj_pres, el)=tenga',
            'irreg(subj_pres, nosotros)=tengamos',
            'irreg(subj_pres, vosotros)=tengáis',
            'irreg(subj_pres, ellos)=tengan',
            'irreg(subj_impf, yo)=tuviera',
            'irreg(subj_impf, tu)=tuvieras',
            'irreg(subj_impf, el)=tuviera',
            'irreg(subj_impf, nosotros)=tuviéramos',
            'irreg(subj_impf, vosotros)=tuvierais',
            'irreg(subj_impf, ellos)=tuvieran',
          ],
        },
        trailing_words: ['tener que', 'tener hambre', 'tener frío'],
      },
    ],
    related_spanish: ['mantener'],
    related_english: ['to own'],
  },
  {
    id: '000006',
    starred: false,
    meanings: [
      {
        pos: 'verb',
        as_in: 'to bathe oneself',
        spanish: {
          word: 'bañarse',
        },
        english: {
          word: 'to bathe',
        },
        tags: {
          visible: ['REFL'],
          region: 'LATAM',
        },
        trailing_words: ['bañarse en la playa'],
      },
      {
        pos: 'verb',
        as_in: 'to bathe someone/something else',
        spanish: {
          word: 'bañar',
        },
        english: {
          word: 'to bathe',
        },
        tags: {
          visible: [],
          region: 'SPAIN',
        },
      },
    ],
    related_spanish: ['ducharse'],
    related_english: [],
  },
  {
    id: '000007',
    starred: true,
    meanings: [
      {
        pos: 'verb',
        as_in: 'identity or description',
        spanish: {
          word: 'ser',
          note: 'Used for inherent traits, time, origin, and professions.',
        },
        english: {
          word: 'to be',
        },
        tags: {
          visible: ['IMPERSONAL'],
          invisible: [
            'irreg(ind_pres, yo)=soy',
            'irreg(ind_pres, tu)=eres',
            'irreg(ind_pres, el)=es',
            'irreg(ind_pres, nosotros)=somos',
            'irreg(ind_pres, vosotros)=sois',
            'irreg(ind_pres, ellos)=son',
            'irreg(ind_pret, yo)=fui',
            'irreg(ind_pret, tu)=fuiste',
            'irreg(ind_pret, el)=fue',
            'irreg(ind_pret, nosotros)=fuimos',
            'irreg(ind_pret, vosotros)=fuisteis',
            'irreg(ind_pret, ellos)=fueron',
            'irreg(ind_impf, yo)=era',
            'irreg(ind_impf, tu)=eras',
            'irreg(ind_impf, el)=era',
            'irreg(ind_impf, nosotros)=éramos',
            'irreg(ind_impf, vosotros)=erais',
            'irreg(ind_impf, ellos)=eran',
            'irreg(pr_sbj, yo)=sea',
            'irreg(pr_sbj, tu)=seas',
            'irreg(pr_sbj, el)=sea',
            'irreg(pr_sbj, nosotros)=seamos',
            'irreg(pr_sbj, vosotros)=seáis',
            'irreg(pr_sbj, ellos)=sean',
            'irreg(subj_impf, yo)=fuera',
            'irreg(subj_impf, tu)=fueras',
            'irreg(subj_impf, el)=fuera',
            'irreg(subj_impf, nosotros)=fuéramos',
            'irreg(subj_impf, vosotros)=fuerais',
            'irreg(subj_impf, ellos)=fueran',
          ],
        },
        trailing_words: ['ser de', 'ser para'],
      },
    ],
    related_spanish: ['estar'],
    related_english: [],
  },
];
