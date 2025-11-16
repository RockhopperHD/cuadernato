import { DictionaryEntry } from '../types';

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    id: '000001',
    starred: false,
    connected: ['000002'],
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
    connected: ['000001'],
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
    connected: ['000012'],
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
    connected: ['000007', '000008'],
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
    connected: ['000009'],
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
    connected: ['000008', '000005'],
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
  {
    id: '000008',
    starred: true,
    connected: ['000007', '000005'],
    meanings: [
      {
        pos: 'verb',
        as_in: 'temporary state or location',
        spanish: {
          word: 'estar',
          note: 'Used for emotions, health, and locations that change.',
        },
        english: {
          word: 'to be',
          note: 'Covers temporary states and spatial placement.',
        },
        tags: {
          invisible: [
            'irreg(ind_pres, yo)=estoy',
            'irreg(ind_pres, tu)=estás',
            'irreg(ind_pres, el)=está',
            'irreg(ind_pres, nosotros)=estamos',
            'irreg(ind_pres, vosotros)=estáis',
            'irreg(ind_pres, ellos)=están',
            'irreg(ind_pret, yo)=estuve',
            'irreg(ind_pret, tu)=estuviste',
            'irreg(ind_pret, el)=estuvo',
            'irreg(ind_pret, nosotros)=estuvimos',
            'irreg(ind_pret, vosotros)=estuvisteis',
            'irreg(ind_pret, ellos)=estuvieron',
            'irreg(subj_pres, yo)=esté',
            'irreg(subj_pres, tu)=estés',
            'irreg(subj_pres, el)=esté',
            'irreg(subj_pres, nosotros)=estemos',
            'irreg(subj_pres, vosotros)=estéis',
            'irreg(subj_pres, ellos)=estén',
            'irreg(subj_impf, yo)=estuviera',
            'irreg(subj_impf, tu)=estuvieras',
            'irreg(subj_impf, el)=estuviera',
            'irreg(subj_impf, nosotros)=estuviéramos',
            'irreg(subj_impf, vosotros)=estuvierais',
            'irreg(subj_impf, ellos)=estuvieran',
          ],
        },
        trailing_words: ['estar en casa', 'estar cansado'],
      },
    ],
    related_spanish: ['ser'],
    related_english: ['to feel'],
  },
  {
    id: '000009',
    starred: false,
    connected: ['000006', '000010'],
    meanings: [
      {
        pos: 'verb',
        as_in: 'to sleep',
        spanish: {
          word: 'dormir',
          note: 'Common stem-changing -ir verb.',
        },
        english: {
          word: 'to sleep',
        },
        tags: {
          invisible: ['o>ue', 'slip_o>u', 'irreg(gerund)=durmiendo'],
        },
        trailing_words: ['dormir la siesta', 'dormir profundamente'],
      },
    ],
    related_spanish: ['descansar'],
    related_english: ['to nap'],
  },
  {
    id: '000010',
    starred: false,
    connected: ['000009', '000013'],
    meanings: [
      {
        pos: 'adjective',
        as_in: 'quick action',
        spanish: {
          word: 'rápido',
          gender_map: {
            rápido: 'm',
            rápida: 'f',
          },
        },
        english: {
          word: 'fast',
        },
        tags: {
          visible: ['GS'],
        },
        trailing_words: ['un tren rápido'],
      },
      {
        pos: 'adverb',
        as_in: 'quickly',
        spanish: {
          word: 'rápido',
          note: 'Often used as an adverb even though it looks like an adjective.',
        },
        english: {
          word: 'quickly',
        },
        tags: {
          visible: ['indeclinable'],
        },
      },
    ],
    related_spanish: [],
    related_english: ['swift'],
  },
  {
    id: '000011',
    starred: false,
    connected: ['000012', '000013'],
    meanings: [
      {
        pos: 'verb',
        as_in: 'to yap endlessly',
        spanish: {
          word: 'yapear',
          note: 'Demo verb for the UI overhaul; expect goofy slang contexts.',
        },
        english: {
          word: 'to yap',
          note: 'Used jokingly for nonstop chatting.',
        },
        tags: {
          visible: ['COLLOQUIAL'],
          invisible: ['e>ie', 'go', 'irreg(imper_affirm, tú)=yapea', 'irreg(gerund)=yapeando'],
          region: 'LATAM',
        },
        trailing_words: ['yapear sin parar', 'yapear de algo insignificante'],
      },
      {
        pos: 'verb',
        as_in: 'to yap at yourself',
        spanish: {
          word: 'yapearse',
          note: 'Reflexive flavor for when someone gets themselves worked up.',
        },
        english: {
          word: 'to yap at yourself',
        },
        tags: {
          visible: ['REFL', 'COLLOQUIAL'],
          invisible: ['irreg(imper_neg, tú)=no yapees'],
        },
      },
    ],
    related_spanish: [],
    related_english: [],
  },
  {
    id: '000012',
    starred: false,
    connected: ['000011', '000013', '000003'],
    meanings: [
      {
        pos: 'noun',
        as_in: 'playground insult',
        spanish: {
          word: 'yourmom-o',
          note: 'Fictional borrowing that stays feminine despite the -o ending.',
          gender_map: {
            'yourmom-o': 'f',
            'yourmom-a': 'f',
          },
        },
        english: {
          word: 'your mom',
          note: 'Demo insult noun for stress-testing tag pills.',
        },
        tags: {
          visible: ['VULGAR', 'GS', 'article_m_override'],
          region: 'SPAIN',
        },
        trailing_words: ['tu yourmom-o favorita'],
      },
    ],
    related_spanish: [],
    related_english: [],
  },
  {
    id: '000013',
    starred: true,
    connected: ['000011', '000012', '000010'],
    meanings: [
      {
        pos: 'adjective',
        as_in: 'epically tasty',
        spanish: {
          word: 'epicsauco',
          note: 'Imaginary adjective meaning “epic sauce.”',
        },
        english: {
          word: 'epic sauce',
          note: 'Adjective meaning overwhelmingly awesome.',
        },
        tags: {
          visible: ['COLLOQUIAL', 'unisex'],
        },
        trailing_words: ['una vibra epicsauca'],
      },
      {
        pos: 'noun',
        as_in: 'slang compliment',
        spanish: {
          word: 'el epicsauco',
          note: 'Sometimes used as a stand-alone noun meaning the cool factor.',
          gender_map: {
            'el epicsauco': 'm',
            'la epicsauca': 'f',
          },
        },
        english: {
          word: 'the epic sauce',
        },
        tags: {
          visible: ['COLLOQUIAL'],
        },
      },
    ],
    related_spanish: [],
    related_english: ['epicness'],
  },
];
