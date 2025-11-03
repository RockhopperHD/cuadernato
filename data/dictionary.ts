import { DictionaryEntry } from '../types';

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    id: '000001',
    starred: false,
    meanings: [
      {
        spanish: { word: 'pato', pos: 'noun', as_in: 'the bird', gender_map: { 'pato': 'm', 'pata': 'f' } },
        english: { word: 'duck', pos: 'noun', as_in: 'the bird' },
        note: 'When female, pata can be a female duck or an animal paw.'
      },
      {
        spanish: { word: 'pata', pos: 'noun', as_in: 'of an animal', gender_map: { 'pata': 'f' } },
        english: { word: 'paw', pos: 'noun', as_in: "of an animal" }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000002',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'acabar',
          pos: 'verb',
          as_in: 'to be done with',
          conjugations: {
            indicative: {
              present: { yo: 'acabo', tu: 'acabas', el: 'acaba', nosotros: 'acabamos', vosotros: 'acabáis', ellos: 'acaban' },
              preterite: { yo: 'acabé', tu: 'acabaste', el: 'acabó', nosotros: 'acabamos', vosotros: 'acabasteis', ellos: 'acabaron' },
              imperfect: { yo: 'acababa', tu: 'acababas', el: 'acababa', nosotros: 'acabábamos', vosotros: 'acababais', ellos: 'acababan' }
            }
          }
        },
        english: { word: 'to end', pos: 'verb', as_in: 'to be done with' }
      },
      {
        spanish: { word: 'acabar', pos: 'verb', as_in: 'to complete a task' },
        english: { word: 'to finish', pos: 'verb', as_in: 'to complete a task' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000003',
    starred: false,
    meanings: [
      {
        spanish: { word: 'mierda', pos: 'noun', as_in: 'feces', tags: ['VULGAR'], gender_map: { 'mierda': 'f' } },
        english: { word: 'shit', pos: 'noun', as_in: 'feces' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000004',
    starred: true,
    meanings: [
      {
        spanish: {
          word: 'nadar',
          pos: 'verb',
          region: 'LATAM',
          as_in: 'to recreationally go in water',
          conjugations: {
            indicative: {
              present: { yo: 'nado', tu: 'nadas', el: 'nada', nosotros: 'nadamos', vosotros: 'nadáis', ellos: 'nadan' }
            }
          }
        },
        english: { word: 'to swim', pos: 'verb', as_in: 'to recreationally go in water' }
      },
      {
        spanish: {
          word: 'bañar',
          pos: 'verb',
          region: 'SPAIN',
          as_in: 'to recreationally go in water',
          conjugations: {
            indicative: {
              present: { yo: 'baño', tu: 'bañas', el: 'baña', nosotros: 'bañamos', vosotros: 'bañáis', ellos: 'bañan' }
            }
          }
        },
        english: { word: 'to swim', pos: 'verb', as_in: 'to recreationally go in water' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000005',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'tener',
          pos: 'verb',
          as_in: 'you have an object',
          conjugations: {
            indicative: {
              present: { yo: 'ten(go)', tu: 't((ie))nes', el: 't((ie))ne', nosotros: 'tenemos', vosotros: 'tenéis', ellos: 't((ie))nen' },
              preterite: { yo: 'tuve', tu: 'tuviste', el: 'tuvo', nosotros: 'tuvimos', vosotros: 'tuvisteis', ellos: 'tuvieron'},
              imperfect: { yo: 'tenía', tu: 'tenías', el: 'tenía', nosotros: 'teníamos', vosotros: 'teníais', ellos: 'tenían'}
            }
          }
        },
        english: { word: 'to have', pos: 'verb', as_in: 'you have an object' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000006',
    starred: true,
    meanings: [
      {
        spanish: {
          word: 'ducharse',
          pos: 'verb',
          as_in: 'to clean yourself with water',
          reflexive: true,
          tags: ['REFLEXIVE'],
          conjugations: {
            indicative: {
              present: { yo: '(((me))) ducho', tu: '(((te))) duchas', el: '(((se))) ducha', nosotros: '(((nos))) duchamos', vosotros: '(((os))) ducháis', ellos: '(((se))) duchan' }
            }
          }
        },
        english: { word: 'to shower', pos: 'verb', as_in: 'to clean yourself with water' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
   {
    id: '000007',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'patón',
          pos: 'adjective',
          as_in: 'having large feet',
          gender_map: { 'patón': 'm', 'patona': 'f' }
        },
        english: { word: 'big-footed', pos: 'adjective', as_in: 'having large feet' }
      },
      {
        spanish: { word: 'patón', pos: 'adjective', as_in: 'awkward in movement' },
        english: { word: 'clumsy', pos: 'adjective', as_in: 'awkward in movement' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
   {
    id: '000008',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'estudiante',
          pos: 'noun',
          as_in: 'a person who studies',
          gender_map: { 'el/la estudiante': 'n' }
        },
        english: { word: 'student', pos: 'noun', as_in: 'a person who studies' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000009',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'comer',
          pos: 'verb',
          as_in: 'to consume food',
          conjugations: {
            indicative: {
              present: { yo: 'como', tu: 'comes', el: 'come', nosotros: 'comemos', vosotros: 'coméis', ellos: 'comen' }
            }
          }
        },
        english: { word: 'to eat', pos: 'verb', as_in: 'to consume food' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000010',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'chico',
          pos: 'noun',
          as_in: 'a child or young person',
          gender_map: { 'chico': 'm', 'chica': 'f', 'chice': 'n' }
        },
        english: { word: 'kid', pos: 'noun', as_in: 'a child or young person' },
        note: "This doesn't inherently refer to a child -- in Spain, chicos is often used to refer to any group of young people, including teenagers and young adults."
      },
      {
        spanish: {
          word: 'chico',
          pos: 'adjective',
          as_in: 'small',
          gender_map: { 'chico': 'm', 'chica': 'f', 'chice': 'n' }
        },
        english: { word: 'small', pos: 'adjective', as_in: 'of a size that is less than normal' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000011',
    starred: false,
    meanings: [
      {
        spanish: { word: 'derecho', pos: 'adjective', as_in: 'straight, not crooked or bent', tags: ['GENDER-SPECIFIC'], gender_map: { 'derecho': 'm', 'derecha': 'f' } },
        english: { word: 'straight', pos: 'adjective', as_in: 'not crooked or bent' },
        note: 'As an adjective, it must match the gender of the noun it describes (e.g., "un camino derecho", "una línea derecha").'
      },
      {
        spanish: { word: 'derecho', pos: 'noun', as_in: 'a legal or moral entitlement', tags: ['GENDER-SPECIFIC'], gender_map: { 'derecho': 'm' } },
        english: { word: 'right', pos: 'noun', as_in: 'a legal or moral entitlement' }
      },
      {
        spanish: { word: 'derecho', pos: 'noun', as_in: 'the study of law', tags: ['GENDER-SPECIFIC'], gender_map: { 'derecho': 'm' } },
        english: { word: 'law', pos: 'noun', as_in: 'the field of study' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000012',
    starred: false,
    meanings: [
      {
        spanish: { word: 'derecha', pos: 'noun', as_in: 'the right side or direction', tags: ['GENDER-SPECIFIC'], gender_map: { 'derecha': 'f' } },
        english: { word: 'right', pos: 'noun', as_in: 'the right side or direction' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000013',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'ser',
          pos: 'verb',
          as_in: 'to be (essence, identity)',
          conjugations: {
            indicative: {
              present: { yo: '(soy)', tu: '(eres)', el: '(es)', nosotros: 'somos', vosotros: 'sois', ellos: '(son)' },
              preterite: { yo: '(fui)', tu: '(fuiste)', el: '(fue)', nosotros: '(fuimos)', vosotros: '(fuisteis)', ellos: '(fueron)' },
              imperfect: { yo: '(era)', tu: '(eras)', el: '(era)', nosotros: 'éramos', vosotros: 'erais', ellos: '(eran)' }
            }
          }
        },
        english: { word: 'to be', pos: 'verb', as_in: 'essence, identity' },
        note: "One of two Spanish verbs meaning 'to be'. `Ser` is used for permanent or lasting attributes (identity, origin, characteristics), while `estar` is used for temporary states and locations."
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000014',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'ir',
          pos: 'verb',
          as_in: 'to move from one place to another',
          conjugations: {
            indicative: {
              present: { yo: 'voy', tu: 'vas', el: 'va', nosotros: 'vamos', vosotros: 'vais', ellos: 'van' },
              preterite: { yo: 'fui', tu: 'fuiste', el: 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', ellos: 'fueron' },
              imperfect: { yo: 'iba', tu: 'ibas', el: 'iba', nosotros: 'íbamos', vosotros: 'ibais', ellos: 'iban' }
            }
          }
        },
        english: { word: 'to go', pos: 'verb', as_in: 'to move' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000015',
    starred: false,
    meanings: [
      {
        spanish: { word: 'casa', pos: 'noun', as_in: 'a building for human habitation', gender_map: { 'casa': 'f' } },
        english: { word: 'house', pos: 'noun', as_in: 'a building for human habitation' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000016',
    starred: false,
    meanings: [
      {
        spanish: { word: 'libro', pos: 'noun', as_in: 'a written or printed work', gender_map: { 'libro': 'm' } },
        english: { word: 'book', pos: 'noun', as_in: 'a written or printed work' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000017',
    starred: false,
    meanings: [
      {
        spanish: { word: 'grande', pos: 'adjective', as_in: 'of considerable size', gender_map: { 'grande': 'n' } },
        english: { word: 'big', pos: 'adjective', as_in: 'of considerable size' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000018',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'trabajar',
          pos: 'verb',
          as_in: 'to engage in physical or mental activity',
          conjugations: {
            indicative: {
              present: { yo: 'trabajo', tu: 'trabajas', el: 'trabaja', nosotros: 'trabajamos', vosotros: 'trabajáis', ellos: 'trabajan' }
            }
          }
        },
        english: { word: 'to work', pos: 'verb', as_in: 'to engage in activity' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000019',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'aprender',
          pos: 'verb',
          as_in: 'to gain knowledge',
          conjugations: {
            indicative: {
              present: { yo: 'aprendo', tu: 'aprendes', el: 'aprende', nosotros: 'aprendemos', vosotros: 'aprendéis', ellos: 'aprenden' }
            }
          }
        },
        english: { word: 'to learn', pos: 'verb', as_in: 'to gain knowledge' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000020',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'vivir',
          pos: 'verb',
          as_in: 'to be alive',
          conjugations: {
            indicative: {
              present: { yo: 'vivo', tu: 'vives', el: 'vive', nosotros: 'vivimos', vosotros: 'vivís', ellos: 'viven' }
            }
          }
        },
        english: { word: 'to live', pos: 'verb', as_in: 'to be alive' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000021',
    starred: false,
    meanings: [
      {
        spanish: { word: 'joder', pos: 'verb', as_in: 'to annoy or to copulate', tags: ['VULGAR'] },
        english: { word: 'to fuck', pos: 'verb', as_in: 'to annoy or to copulate' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000022',
    starred: false,
    meanings: [
      {
        spanish: { word: 'cabeza', pos: 'noun', as_in: 'the upper part of the human body', gender_map: { 'cabeza': 'f' } },
        english: { word: 'head', pos: 'noun', as_in: 'the upper part of the human body' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000023',
    starred: true,
    meanings: [
      {
        spanish: {
          word: 'estar',
          pos: 'verb',
          as_in: 'to be (location, temporary state)',
          conjugations: {
            indicative: {
              present: { yo: 'est(oy)', tu: 'estás', el: 'está', nosotros: 'estamos', vosotros: 'estáis', ellos: 'están' },
              preterite: { yo: '(estuve)', tu: '(estuviste)', el: '(estuvo)', nosotros: '(estuvimos)', vosotros: '(estuvisteis)', ellos: '(estuvieron)' },
              imperfect: { yo: 'estaba', tu: 'estabas', el: 'estaba', nosotros: 'estábamos', vosotros: 'estabais', ellos: 'estaban' }
            }
          }
        },
        english: { word: 'to be', pos: 'verb', as_in: 'location, temporary state' },
        note: "One of two Spanish verbs meaning 'to be'. `Estar` is used for temporary states and locations, while `ser` is used for permanent or lasting attributes."
      }
    ],
    related_spanish: [],
    related_english: []
  }
];