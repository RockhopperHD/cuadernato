import { DictionaryEntry } from '../types';

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    id: '1',
    starred: false,
    connected: ['2'],
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
      },
    ],
    related_spanish: ['pata'],
    related_english: ['duckling'],
  },
  {
    id: '2',
    starred: false,
    connected: ['1'],
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
    id: '3',
    starred: false,
    connected: ['12'],
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
    id: '4',
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
    id: '5',
    starred: true,
    connected: ['7', '8'],
    grand_note: {
      title: 'Tener is everywhere',
      description:
        'This verb expresses possession, age, physical sensations, and obligations like “tener que + infinitivo”.',
    },
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
            'irreg(subj_impf, yo)=tuviera',
            'irreg(subj_impf, tu)=tuvieras',
            'irreg(subj_impf, el)=tuviera',
            'irreg(subj_impf, nosotros)=tuviéramos',
            'irreg(subj_impf, vosotros)=tuvierais',
            'irreg(subj_impf, ellos)=tuvieran',
          ],
        },
        trailing_words: ['tener que + infinitivo'],
      },
    ],
    related_spanish: ['mantener'],
    related_english: ['to own'],
  },
  {
    id: '6',
    starred: false,
    connected: ['9'],
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
    id: '7',
    starred: true,
    connected: ['8', '5'],
    grand_note: {
      title: 'Ser vs. estar',
      description: 'Use ser for identity, time, and origin. Switch to estar for changing states or locations.',
    },
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
    id: '8',
    starred: true,
    connected: ['7', '5'],
    grand_note: {
      title: 'Ser vs. estar',
      description: 'Use estar for emotions, health, and temporary locations while ser handles permanent traits.',
    },
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
            'irreg(subj_pres, ellos)=estén',
            'irreg(subj_impf, yo)=estuviera',
            'irreg(subj_impf, tu)=estuvieras',
            'irreg(subj_impf, el)=estuviera',
            'irreg(subj_impf, nosotros)=estuviéramos',
            'irreg(subj_impf, vosotros)=estuvierais',
            'irreg(subj_impf, ellos)=estuvieran',
          ],
        },
        trailing_words: ['estar + gerundio'],
      },
    ],
    related_spanish: ['ser'],
    related_english: ['to feel'],
  },
  {
    id: '9',
    starred: false,
    connected: ['6', '10'],
    meanings: [
      {
        pos: 'verb',
        as_in: 'to sleep',
        spanish: {
          word: 'dormir',
        },
        english: {
          word: 'to sleep',
        },
        tags: {
          invisible: ['o>ue', 'slip_o>u', 'irreg(gerund)=durmiendo'],
        },
      },
    ],
    related_spanish: ['descansar'],
    related_english: ['to nap'],
  },
  {
    id: '10',
    starred: false,
    connected: ['9', '13'],
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
    id: '11',
    starred: false,
    connected: ['12', '13'],
    meanings: [
      {
        pos: 'verb',
        as_in: 'to yap endlessly',
        spanish: {
          word: 'yapear',
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
      },
      {
        pos: 'verb',
        as_in: 'to yap at yourself',
        spanish: {
          word: 'yapearse',
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
    id: '12',
    starred: false,
    connected: ['11', '13', '3'],
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
      },
    ],
    related_spanish: [],
    related_english: [],
  },
  {
    id: '13',
    starred: true,
    connected: ['11', '12', '10'],
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
