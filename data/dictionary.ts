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
            },
            subjunctive: {
              present: { yo: 'acabe', tu: 'acabes', el: 'acabe', nosotros: 'acabemos', vosotros: 'acabéis', ellos: 'acaben' },
              imperfect: { yo: 'acabara', tu: 'acabaras', el: 'acabara', nosotros: 'acabáramos', vosotros: 'acabarais', ellos: 'acabaran' }
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
              present: { yo: 'nado', tu: 'nadas', el: 'nada', nosotros: 'nadamos', vosotros: 'nadáis', ellos: 'nadan' },
              preterite: { yo: 'nadé', tu: 'nadaste', el: 'nadó', nosotros: 'nadamos', vosotros: 'nadasteis', ellos: 'nadaron' },
              imperfect: { yo: 'nadaba', tu: 'nadabas', el: 'nadaba', nosotros: 'nadábamos', vosotros: 'nadabais', ellos: 'nadaban' }
            },
            subjunctive: {
              present: { yo: 'nade', tu: 'nades', el: 'nade', nosotros: 'nademos', vosotros: 'nadéis', ellos: 'naden' },
              imperfect: { yo: 'nadara', tu: 'nadaras', el: 'nadara', nosotros: 'nadáramos', vosotros: 'nadarais', ellos: 'nadaran' }
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
              present: { yo: 'baño', tu: 'bañas', el: 'baña', nosotros: 'bañamos', vosotros: 'bañáis', ellos: 'bañan' },
              preterite: { yo: 'bañé', tu: 'bañaste', el: 'bañó', nosotros: 'bañamos', vosotros: 'bañasteis', ellos: 'bañaron' },
              imperfect: { yo: 'bañaba', tu: 'bañabas', el: 'bañaba', nosotros: 'bañábamos', vosotros: 'bañabais', ellos: 'bañaban' }
            },
            subjunctive: {
              present: { yo: 'bañe', tu: 'bañes', el: 'bañe', nosotros: 'bañemos', vosotros: 'bañéis', ellos: 'bañen' },
              imperfect: { yo: 'bañara', tu: 'bañaras', el: 'bañara', nosotros: 'bañáramos', vosotros: 'bañarais', ellos: 'bañaran' }
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
            },
            subjunctive: {
              present: { yo: 'tenga', tu: 'tengas', el: 'tenga', nosotros: 'tengamos', vosotros: 'tengáis', ellos: 'tengan' },
              imperfect: { yo: 'tuviera', tu: 'tuvieras', el: 'tuviera', nosotros: 'tuviéramos', vosotros: 'tuvierais', ellos: 'tuvieran' }
            }
          },
          exceptions: [
            { type: 'affirmative command', pronoun: 'tú', word: 'ten' }
          ]
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
              present: { yo: '(((me))) ducho', tu: '(((te))) duchas', el: '(((se))) ducha', nosotros: '(((nos))) duchamos', vosotros: '(((os))) ducháis', ellos: '(((se))) duchan' },
              preterite: { yo: '(((me))) duché', tu: '(((te))) duchaste', el: '(((se))) duchó', nosotros: '(((nos))) duchamos', vosotros: '(((os))) duchasteis', ellos: '(((se))) ducharon' },
              imperfect: { yo: '(((me))) duchaba', tu: '(((te))) duchabas', el: '(((se))) duchaba', nosotros: '(((nos))) duchábamos', vosotros: '(((os))) duchabais', ellos: '(((se))) duchaban' }
            },
            subjunctive: {
                present: { yo: '(((me))) duche', tu: '(((te))) duches', el: '(((se))) duche', nosotros: '(((nos))) duchemos', vosotros: '(((os))) duchéis', ellos: '(((se))) duchan' },
                imperfect: { yo: '(((me))) duchara', tu: '(((te))) ducharas', el: '(((se))) duchara', nosotros: '(((nos))) ducháramos', vosotros: '(((os))) ducharais', ellos: '(((se))) ducharan' }
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
              present: { yo: 'como', tu: 'comes', el: 'come', nosotros: 'comemos', vosotros: 'coméis', ellos: 'comen' },
              preterite: { yo: 'comí', tu: 'comiste', el: 'comió', nosotros: 'comimos', vosotros: 'comisteis', ellos: 'comieron' },
              imperfect: { yo: 'comía', tu: 'comías', el: 'comía', nosotros: 'comíamos', vosotros: 'comíais', ellos: 'comían' }
            },
            subjunctive: {
                present: { yo: 'coma', tu: 'comas', el: 'coma', nosotros: 'comamos', vosotros: 'comáis', ellos: 'coman' },
                imperfect: { yo: 'comiera', tu: 'comieras', el: 'comiera', nosotros: 'comiéramos', vosotros: 'comierais', ellos: 'comieran' }
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
    starred: true,
    grand_note: {
        title: "Split Word",
        description: "In English, 'to be' is a single verb. In Spanish, it's split into two: `ser` and `estar`. `Ser` is used for permanent or lasting attributes (identity, origin, characteristics). `Estar` is used for temporary states and locations."
    },
    meanings: [
      {
        spanish: {
          word: 'ser',
          pos: 'verb',
          as_in: 'essence, identity',
          conjugations: {
            indicative: {
              present: { yo: '(soy)', tu: '(eres)', el: '(es)', nosotros: 'somos', vosotros: 'sois', ellos: '(son)' },
              preterite: { yo: '(fui)', tu: '(fuiste)', el: '(fue)', nosotros: '(fuimos)', vosotros: '(fuisteis)', ellos: '(fueron)' },
              imperfect: { yo: '(era)', tu: '(eras)', el: '(era)', nosotros: 'éramos', vosotros: 'erais', ellos: '(eran)' }
            },
            subjunctive: {
              present: { yo: 'sea', tu: 'seas', el: 'sea', nosotros: 'seamos', vosotros: 'seáis', ellos: 'sean' },
              imperfect: { yo: 'fuera', tu: 'fueras', el: 'fuera', nosotros: 'fuéramos', vosotros: 'fuerais', ellos: 'fueran' }
            }
          },
          exceptions: [
            { type: 'affirmative command', pronoun: 'tú', word: 'sé' }
          ]
        },
        english: { word: 'to be', pos: 'verb', as_in: 'essence, identity' },
        note: "Use `ser` for permanent or lasting attributes."
      },
      {
        spanish: {
          word: 'estar',
          pos: 'verb',
          as_in: 'location, temporary state',
          conjugations: {
            indicative: {
              present: { yo: 'est(oy)', tu: 'estás', el: 'está', nosotros: 'estamos', vosotros: 'estáis', ellos: 'están' },
              preterite: { yo: '(estuve)', tu: '(estuviste)', el: '(estuvo)', nosotros: '(estuvimos)', vosotros: '(estuvisteis)', ellos: '(estuvieron)' },
              imperfect: { yo: 'estaba', tu: 'estabas', el: 'estaba', nosotros: 'estábamos', vosotros: 'estabais', ellos: 'estaban' }
            },
            subjunctive: {
              present: { yo: 'esté', tu: 'estés', el: 'esté', nosotros: 'estemos', vosotros: 'estéis', ellos: 'estén' },
              imperfect: { yo: 'estuviera', tu: 'estuvieras', el: 'estuviera', nosotros: 'estuviéramos', vosotros: 'estuvierais', ellos: 'estuvieran' }
            }
          }
        },
        english: { word: 'to be', pos: 'verb', as_in: 'location, temporary state' },
        note: "Use `estar` for temporary states and locations."
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
            },
            subjunctive: {
              present: { yo: 'vaya', tu: 'vayas', el: 'vaya', nosotros: 'vayamos', vosotros: 'vayáis', ellos: 'vayan' },
              imperfect: { yo: 'fuera', tu: 'fueras', el: 'fuera', nosotros: 'fuéramos', vosotros: 'fuerais', ellos: 'fueran' }
            }
          },
          exceptions: [
            { type: 'affirmative command', pronoun: 'tú', word: 've' }
          ]
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
              present: { yo: 'trabajo', tu: 'trabajas', el: 'trabaja', nosotros: 'trabajamos', vosotros: 'trabajáis', ellos: 'trabajan' },
              preterite: { yo: 'trabajé', tu: 'trabajaste', el: 'trabajó', nosotros: 'trabajamos', vosotros: 'trabajasteis', ellos: 'trabajaron' },
              imperfect: { yo: 'trabajaba', tu: 'trabajabas', el: 'trabajaba', nosotros: 'trabajábamos', vosotros: 'trabajabais', ellos: 'trabajaban' }
            },
            subjunctive: {
              present: { yo: 'trabaje', tu: 'trabajes', el: 'trabaje', nosotros: 'trabajemos', vosotros: 'trabajéis', ellos: 'trabajen' },
              imperfect: { yo: 'trabajara', tu: 'trabajaras', el: 'trabajara', nosotros: 'trabajáramos', vosotros: 'trabajarais', ellos: 'trabajaran' }
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
              present: { yo: 'aprendo', tu: 'aprendes', el: 'aprende', nosotros: 'aprendemos', vosotros: 'aprendéis', ellos: 'aprenden' },
              preterite: { yo: 'aprendí', tu: 'aprendiste', el: 'aprendió', nosotros: 'aprendimos', vosotros: 'aprendisteis', ellos: 'aprendieron' },
              imperfect: { yo: 'aprendía', tu: 'aprendías', el: 'aprendía', nosotros: 'aprendíamos', vosotros: 'aprendíais', ellos: 'aprendían' }
            },
            subjunctive: {
              present: { yo: 'aprender', tu: 'aprendas', el: 'aprenda', nosotros: 'aprendamos', vosotros: 'aprendáis', ellos: 'aprendan' },
              imperfect: { yo: 'aprendiera', tu: 'aprendieras', el: 'aprendiera', nosotros: 'aprendiéramos', vosotros: 'aprendierais', ellos: 'aprendieran' }
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
              present: { yo: 'vivo', tu: 'vives', el: 'vive', nosotros: 'vivimos', vosotros: 'vivís', ellos: 'viven' },
              preterite: { yo: 'viví', tu: 'viviste', el: 'vivió', nosotros: 'vivimos', vosotros: 'vivisteis', ellos: 'vivieron' },
              imperfect: { yo: 'vivía', tu: 'vivías', el: 'vivía', nosotros: 'vivíamos', vosotros: 'vivíais', ellos: 'vivían' }
            },
            subjunctive: {
              present: { yo: 'viva', tu: 'vivas', el: 'viva', nosotros: 'vivamos', vosotros: 'viváis', ellos: 'vivan' },
              imperfect: { yo: 'viviera', tu: 'vivieras', el: 'viviera', nosotros: 'viviéramos', vosotros: 'vivierais', ellos: 'vivieran' }
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
        spanish: {
          word: 'joder',
          pos: 'verb',
          as_in: 'to annoy or to copulate',
          tags: ['VULGAR'],
          conjugations: {
            indicative: {
              present: { yo: 'jodo', tu: 'jodes', el: 'jode', nosotros: 'jodemos', vosotros: 'jodéis', ellos: 'joden' },
              preterite: { yo: 'jodí', tu: 'jodiste', el: 'jodió', nosotros: 'jodimos', vosotros: 'jodisteis', ellos: 'jodieron' },
              imperfect: { yo: 'jodía', tu: 'jodías', el: 'jodía', nosotros: 'jodíamos', vosotros: 'jodíais', ellos: 'jodían' }
            },
            subjunctive: {
              present: { yo: 'joda', tu: 'jodas', el: 'joda', nosotros: 'jodamos', vosotros: 'jodáis', ellos: 'jodan' },
              imperfect: { yo: 'jodiera', tu: 'jodieras', el: 'jodiera', nosotros: 'jodiéramos', vosotros: 'jodierais', ellos: 'jodieran' }
            }
          }
        },
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
    id: '000024',
    starred: false,
    meanings: [
      {
        spanish: { 
          word: 'vale', 
          pos: 'adverb',
          as_in: 'agreement or confirmation',
          region: 'SPAIN',
          tags: ['COLLOQUIAL']
        },
        english: { word: 'OK', pos: 'adverb', as_in: 'agreement or confirmation' },
        note: 'A very common colloquial term in Spain used to mean "OK", "alright", "got it", or to show agreement.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000025',
    starred: false,
    meanings: [
        {
            spanish: { word: 'araña', pos: 'noun', as_in: 'the arachnid', gender_map: { 'araña': 'f' } },
            english: { word: 'spider', pos: 'noun', as_in: 'the arachnid' }
        },
        {
            spanish: { word: 'araña', pos: 'noun', as_in: 'a light fixture', gender_map: { 'araña': 'f' } },
            english: { word: 'chandelier', pos: 'noun', as_in: 'a light fixture' }
        }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000026',
    starred: false,
    meanings: [
      {
        spanish: { word: 'agua', pos: 'noun', as_in: 'the liquid', gender_map: { 'agua': 'f' } },
        english: { word: 'water', pos: 'noun', as_in: 'the liquid' },
        note: 'Agua is a feminine noun, but uses the masculine article "el" in the singular (el agua) to avoid the "a-a" sound. In plural, it is "las aguas".'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000027',
    starred: false,
    meanings: [
        {
            spanish: { word: 'sol', pos: 'noun', as_in: 'the star at the center of the Solar System', gender_map: { 'sol': 'm' } },
            english: { word: 'sun', pos: 'noun', as_in: 'the star we orbit' }
        }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000028',
    starred: false,
    meanings: [
        {
            spanish: { word: 'luna', pos: 'noun', as_in: 'the Earth\'s natural satellite', gender_map: { 'luna': 'f' } },
            english: { word: 'moon', pos: 'noun', as_in: 'the Earth\'s natural satellite' }
        }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000029',
    starred: false,
    meanings: [
        {
            spanish: { word: 'coche', pos: 'noun', as_in: 'a road vehicle', region: 'SPAIN', gender_map: { 'coche': 'm' } },
            english: { word: 'car', pos: 'noun', as_in: 'a road vehicle' },
        },
        {
            spanish: { word: 'carro', pos: 'noun', as_in: 'a road vehicle', region: 'LATAM', gender_map: { 'carro': 'm' } },
            english: { word: 'car', pos: 'noun', as_in: 'a road vehicle' },
        }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000030',
    starred: false,
    meanings: [
        {
            spanish: { word: 'ordenador', pos: 'noun', as_in: 'an electronic device', region: 'SPAIN', gender_map: { 'ordenador': 'm' } },
            english: { word: 'computer', pos: 'noun', as_in: 'an electronic device' },
        },
        {
            spanish: { word: 'computadora', pos: 'noun', as_in: 'an electronic device', region: 'LATAM', gender_map: { 'computadora': 'f' } },
            english: { word: 'computer', pos: 'noun', as_in: 'an electronic device' },
        }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000031',
    starred: false,
    meanings: [
      {
        spanish: { word: 'gato', pos: 'noun', as_in: 'the animal', gender_map: { 'gato': 'm', 'gata': 'f' } },
        english: { word: 'cat', pos: 'noun', as_in: 'the animal' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000032',
    starred: false,
    meanings: [
      {
        spanish: { word: 'perro', pos: 'noun', as_in: 'the animal', gender_map: { 'perro': 'm', 'perra': 'f' } },
        english: { word: 'dog', pos: 'noun', as_in: 'the animal' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000033',
    starred: false,
    meanings: [
      {
        spanish: { word: 'amigo', pos: 'noun', as_in: 'a companion', gender_map: { 'amigo': 'm', 'amiga': 'f' } },
        english: { word: 'friend', pos: 'noun', as_in: 'a companion' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000034',
    starred: false,
    meanings: [
      {
        spanish: { word: 'tiempo', pos: 'noun', as_in: 'duration or the moment', gender_map: { 'tiempo': 'm' } },
        english: { word: 'time', pos: 'noun', as_in: 'duration or the moment' }
      },
      {
        spanish: { word: 'tiempo', pos: 'noun', as_in: 'atmospheric conditions', gender_map: { 'tiempo': 'm' } },
        english: { word: 'weather', pos: 'noun', as_in: 'atmospheric conditions' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000035',
    starred: false,
    meanings: [
      {
        spanish: { word: 'gente', pos: 'noun', as_in: 'human beings in general', gender_map: { 'gente': 'f' } },
        english: { word: 'people', pos: 'noun', as_in: 'human beings in general' },
        note: '`Gente` is a singular feminine noun in Spanish, even though it refers to a group of people.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000036',
    starred: false,
    meanings: [
      {
        spanish: { word: 'día', pos: 'noun', as_in: 'a 24-hour period', gender_map: { 'día': 'm' } },
        english: { word: 'day', pos: 'noun', as_in: 'a 24-hour period' },
        note: 'Despite ending in -a, `día` is a masculine noun.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000037',
    starred: false,
    meanings: [
      {
        spanish: { word: 'mano', pos: 'noun', as_in: 'part of the body', gender_map: { 'mano': 'f' } },
        english: { word: 'hand', pos: 'noun', as_in: 'part of the body' },
        note: 'Despite ending in -o, `mano` is a feminine noun.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000038',
    starred: false,
    meanings: [
      {
        spanish: { word: 'problema', pos: 'noun', as_in: 'a difficulty', gender_map: { 'problema': 'm' } },
        english: { word: 'problem', pos: 'noun', as_in: 'a difficulty' },
        note: 'Nouns of Greek origin ending in -ma are typically masculine, like `problema`.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000039',
    starred: false,
    meanings: [
      {
        spanish: { word: 'ciudad', pos: 'noun', as_in: 'a large town', gender_map: { 'ciudad': 'f' } },
        english: { word: 'city', pos: 'noun', as_in: 'a large town' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000040',
    starred: false,
    meanings: [
      {
        spanish: { word: 'país', pos: 'noun', as_in: 'a nation', gender_map: { 'país': 'm' } },
        english: { word: 'country', pos: 'noun', as_in: 'a nation' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000041',
    starred: false,
    meanings: [
      {
        spanish: { word: 'trabajo', pos: 'noun', as_in: 'a job or task', gender_map: { 'trabajo': 'm' } },
        english: { word: 'work', pos: 'noun', as_in: 'a job or task' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000042',
    starred: false,
    meanings: [
      {
        spanish: { word: 'comida', pos: 'noun', as_in: 'food', gender_map: { 'comida': 'f' } },
        english: { word: 'food', pos: 'noun', as_in: 'sustenance' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000043',
    starred: false,
    meanings: [
      {
        spanish: { word: 'bebida', pos: 'noun', as_in: 'a drink', gender_map: { 'bebida': 'f' } },
        english: { word: 'drink', pos: 'noun', as_in: 'a beverage' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000044',
    starred: false,
    meanings: [
      {
        spanish: { word: 'mañana', pos: 'noun', as_in: 'the early part of the day', gender_map: { 'mañana': 'f' } },
        english: { word: 'morning', pos: 'noun', as_in: 'the early part of the day' }
      },
      {
        spanish: { word: 'mañana', pos: 'adverb', as_in: 'the day after today' },
        english: { word: 'tomorrow', pos: 'adverb', as_in: 'the day after today' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000045',
    starred: false,
    meanings: [
      {
        spanish: { word: 'noche', pos: 'noun', as_in: 'the period of darkness', gender_map: { 'noche': 'f' } },
        english: { word: 'night', pos: 'noun', as_in: 'the period of darkness' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000046',
    starred: false,
    meanings: [
      {
        spanish: { word: 'tarde', pos: 'noun', as_in: 'the part of the day between noon and evening', gender_map: { 'tarde': 'f' } },
        english: { word: 'afternoon', pos: 'noun', as_in: 'between noon and evening' }
      },
      {
        spanish: { word: 'tarde', pos: 'adverb', as_in: 'not on time' },
        english: { word: 'late', pos: 'adverb', as_in: 'not on time' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000047',
    starred: false,
    meanings: [
      {
        spanish: { word: 'hombre', pos: 'noun', as_in: 'an adult male human', gender_map: { 'hombre': 'm' } },
        english: { word: 'man', pos: 'noun', as_in: 'an adult male human' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000048',
    starred: false,
    meanings: [
      {
        spanish: { word: 'mujer', pos: 'noun', as_in: 'an adult female human', gender_map: { 'mujer': 'f' } },
        english: { word: 'woman', pos: 'noun', as_in: 'an adult female human' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000049',
    starred: false,
    meanings: [
      {
        spanish: { word: 'tío', pos: 'noun', as_in: 'the brother of one\'s parent', gender_map: { 'tío': 'm', 'tía': 'f' } },
        english: { word: 'uncle', pos: 'noun', as_in: 'the brother of one\'s parent' }
      },
      {
        spanish: { word: 'tío', pos: 'noun', as_in: 'an informal term for a man', region: 'SPAIN', tags: ['COLLOQUIAL'], gender_map: { 'tío': 'm', 'tía': 'f' } },
        english: { word: 'guy', pos: 'noun', as_in: 'an informal term for a person' },
        note: 'In Spain, "tío" and "tía" are very common ways to refer to a guy or girl, similar to "dude" in English.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000050',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'querer',
          pos: 'verb',
          as_in: 'to desire something',
          conjugations: {
            indicative: {
              present: { yo: 'qu((ie))ro', tu: 'qu((ie))res', el: 'qu((ie))re', nosotros: 'queremos', vosotros: 'queréis', ellos: 'qu((ie))ren' },
              preterite: { yo: 'quise', tu: 'quisiste', el: 'quiso', nosotros: 'quisimos', vosotros: 'quisisteis', ellos: 'quisieron' },
              imperfect: { yo: 'quería', tu: 'querías', el: 'quería', nosotros: 'queríamos', vosotros: 'queríais', ellos: 'querían' }
            },
            subjunctive: {
              present: { yo: 'qu((ie))ra', tu: 'qu((ie))ras', el: 'qu((ie))ra', nosotros: 'queramos', vosotros: 'queráis', ellos: 'qu((ie))ran' },
              imperfect: { yo: 'quisiera', tu: 'quisieras', el: 'quisiera', nosotros: 'quisiéramos', vosotros: 'quisierais', ellos: 'quisieran' }
            }
          }
        },
        english: { word: 'to want', pos: 'verb', as_in: 'to desire something' }
      },
      {
        spanish: {
          word: 'querer',
          pos: 'verb',
          as_in: 'to feel affection for someone'
        },
        english: { word: 'to love', pos: 'verb', as_in: 'to feel affection for someone' },
        note: '`Querer` is used for friends and family. For romantic love, `amar` is often used.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000051',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'poder',
          pos: 'verb',
          as_in: 'to be able to',
          conjugations: {
            indicative: {
              present: { yo: 'p((ue))do', tu: 'p((ue))des', el: 'p((ue))de', nosotros: 'podemos', vosotros: 'podéis', ellos: 'p((ue))den' },
              preterite: { yo: 'pude', tu: 'pudiste', el: 'pudo', nosotros: 'pudimos', vosotros: 'pudisteis', ellos: 'pudieron' },
              imperfect: { yo: 'podía', tu: 'podías', el: 'podía', nosotros: 'podíamos', vosotros: 'podíais', ellos: 'podían' }
            },
            subjunctive: {
              present: { yo: 'p((ue))da', tu: 'p((ue))das', el: 'p((ue))da', nosotros: 'podamos', vosotros: 'podáis', ellos: 'p((ue))dan' },
              imperfect: { yo: 'pudiera', tu: 'pudieras', el: 'pudiera', nosotros: 'pudiéramos', vosotros: 'pudierais', ellos: 'pudieran' }
            }
          }
        },
        english: { word: 'to be able to', pos: 'verb', as_in: 'can' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000052',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'hacer',
          pos: 'verb',
          as_in: 'to perform an action',
          conjugations: {
            indicative: {
              present: { yo: 'ha(go)', tu: 'haces', el: 'hace', nosotros: 'hacemos', vosotros: 'hacéis', ellos: 'hacen' },
              preterite: { yo: 'hice', tu: 'hiciste', el: 'hizo', nosotros: 'hicimos', vosotros: 'hicisteis', ellos: 'hicieron' },
              imperfect: { yo: 'hacía', tu: 'hacías', el: 'hacía', nosotros: 'hacíamos', vosotros: 'hacíais', ellos: 'hacían' }
            },
            subjunctive: {
                present: { yo: 'haga', tu: 'hagas', el: 'haga', nosotros: 'hagamos', vosotros: 'hagáis', ellos: 'hagan' },
                imperfect: { yo: 'hiciera', tu: 'hicieras', el: 'hiciera', nosotros: 'hiciéramos', vosotros: 'hicierais', ellos: 'hicieran' }
            }
          },
          exceptions: [
            { type: 'affirmative command', pronoun: 'tú', word: 'haz' }
          ]
        },
        english: { word: 'to do', pos: 'verb', as_in: 'to perform an action' }
      },
      {
        spanish: { word: 'hacer', pos: 'verb', as_in: 'to create or construct' },
        english: { word: 'to make', pos: 'verb', as_in: 'to create or construct' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000053',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'decir',
          pos: 'verb',
          as_in: 'to utter words',
          conjugations: {
            indicative: {
              present: { yo: 'd(i)go', tu: 'd((i))ces', el: 'd((i))ce', nosotros: 'decimos', vosotros: 'decís', ellos: 'd((i))cen' },
              preterite: { yo: 'dije', tu: 'dijiste', el: 'dijo', nosotros: 'dijimos', vosotros: 'dijisteis', ellos: 'dijeron' },
              imperfect: { yo: 'decía', tu: 'decías', el: 'decía', nosotros: 'decíamos', vosotros: 'decíais', ellos: 'decían' }
            },
            subjunctive: {
              present: { yo: 'diga', tu: 'digas', el: 'diga', nosotros: 'digamos', vosotros: 'digáis', ellos: 'digan' },
              imperfect: { yo: 'dijera', tu: 'dijeras', el: 'dijera', nosotros: 'dijéramos', vosotros: 'dijerais', ellos: 'dijeran' }
            }
          },
          exceptions: [
            { type: 'affirmative command', pronoun: 'tú', word: 'di' }
          ]
        },
        english: { word: 'to say', pos: 'verb', as_in: 'to utter words' }
      },
       {
        spanish: { word: 'decir', pos: 'verb', as_in: 'to narrate' },
        english: { word: 'to tell', pos: 'verb', as_in: 'to narrate' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000054',
    starred: true,
    grand_note: {
        title: "To Know: Saber vs. Conocer",
        description: "Spanish has two verbs for 'to know'. `Saber` is used for facts, information, and how to do something. `Conocer` is used for being familiar with a person, place, or thing."
    },
    meanings: [
      {
        spanish: {
          word: 'saber',
          pos: 'verb',
          as_in: 'to know facts or information',
           conjugations: {
            indicative: {
              present: { yo: '(sé)', tu: 'sabes', el: 'sabe', nosotros: 'sabemos', vosotros: 'sabéis', ellos: 'saben' },
              preterite: { yo: 'supe', tu: 'supiste', el: 'supo', nosotros: 'supimos', vosotros: 'supisteis', ellos: 'supieron' },
              imperfect: { yo: 'sabía', tu: 'sabías', el: 'sabía', nosotros: 'sabíamos', vosotros: 'sabíais', ellos: 'sabían' }
            },
            subjunctive: {
              present: { yo: 'sepa', tu: 'sepas', el: 'sepa', nosotros: 'sepamos', vosotros: 'sepáis', ellos: 'sepan' },
              imperfect: { yo: 'supiera', tu: 'supieras', el: 'supiera', nosotros: 'supiéramos', vosotros: 'supierais', ellos: 'supieran' }
            }
          }
        },
        english: { word: 'to know', pos: 'verb', as_in: 'facts, information, skills' },
        note: "Example: `Yo sé tu nombre.` (I know your name.)"
      },
      {
        spanish: {
          word: 'conocer',
          pos: 'verb',
          as_in: 'to be familiar with people or places',
          conjugations: {
            indicative: {
              present: { yo: 'cono(zc)o', tu: 'conoces', el: 'conoce', nosotros: 'conocemos', vosotros: 'conocéis', ellos: 'conocen' },
              preterite: { yo: 'conocí', tu: 'conociste', el: 'conoció', nosotros: 'conocimos', vosotros: 'conocisteis', ellos: 'conocieron' },
              imperfect: { yo: 'conocía', tu: 'conocías', el: 'conocía', nosotros: 'conocíamos', vosotros: 'conocíais', ellos: 'conocían' }
            },
            subjunctive: {
              present: { yo: 'conozca', tu: 'conozcas', el: 'conozca', nosotros: 'conozcamos', vosotros: 'conozcáis', ellos: 'conozcan' },
              imperfect: { yo: 'conociera', tu: 'conocieras', el: 'conociera', nosotros: 'conociéramos', vosotros: 'conocierais', ellos: 'conocieran' }
            }
          }
        },
        english: { word: 'to know', pos: 'verb', as_in: 'people, places, things' },
        note: "Example: `Yo conozco a María.` (I know Maria.)"
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000055',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'ver',
          pos: 'verb',
          as_in: 'to perceive with the eyes',
          conjugations: {
            indicative: {
              present: { yo: 'v(eo)', tu: 'ves', el: 've', nosotros: 'vemos', vosotros: 'veis', ellos: 'ven' },
              preterite: { yo: 'vi', tu: 'viste', el: 'vio', nosotros: 'vimos', vosotros: 'visteis', ellos: 'vieron' },
              imperfect: { yo: 'veía', tu: 'veías', el: 'veía', nosotros: 'veíamos', vosotros: 'veíais', ellos: 'veían' }
            },
            subjunctive: {
              present: { yo: 'vea', tu: 'veas', el: 'vea', nosotros: 'veamos', vosotros: 'veáis', ellos: 'vean' },
              imperfect: { yo: 'viera', tu: 'vieras', el: 'viera', nosotros: 'viéramos', vosotros: 'vierais', ellos: 'vieran' }
            }
          }
        },
        english: { word: 'to see', pos: 'verb', as_in: 'to perceive with the eyes' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000056',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'dar',
          pos: 'verb',
          as_in: 'to transfer possession',
          conjugations: {
            indicative: {
              present: { yo: 'd(oy)', tu: 'das', el: 'da', nosotros: 'damos', vosotros: 'dais', ellos: 'dan' },
              preterite: { yo: 'di', tu: 'diste', el: 'dio', nosotros: 'dimos', vosotros: 'disteis', ellos: 'dieron' },
              imperfect: { yo: 'daba', tu: 'dabas', el: 'daba', nosotros: 'dábamos', vosotros: 'dabais', ellos: 'daban' }
            },
            subjunctive: {
              present: { yo: 'dé', tu: 'des', el: 'dé', nosotros: 'demos', vosotros: 'deis', ellos: 'den' },
              imperfect: { yo: 'diera', tu: 'dieras', el: 'diera', nosotros: 'diéramos', vosotros: 'dierais', ellos: 'dieran' }
            }
          }
        },
        english: { word: 'to give', pos: 'verb', as_in: 'to transfer possession' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000057',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'venir',
          pos: 'verb',
          as_in: 'to arrive at a place',
          conjugations: {
            indicative: {
              present: { yo: 'ven(go)', tu: 'v((ie))nes', el: 'v((ie))ne', nosotros: 'venimos', vosotros: 'venís', ellos: 'v((ie))nen' },
              preterite: { yo: 'vine', tu: 'viniste', el: 'vino', nosotros: 'vinimos', vosotros: 'vinisteis', ellos: 'vinieron' },
              imperfect: { yo: 'venía', tu: 'venías', el: 'venía', nosotros: 'veníamos', vosotros: 'veníais', ellos: 'venían' }
            },
            subjunctive: {
              present: { yo: 'venga', tu: 'vengas', el: 'venga', nosotros: 'vengamos', vosotros: 'vengáis', ellos: 'vengan' },
              imperfect: { yo: 'viniera', tu: 'vinieras', el: 'viniera', nosotros: 'viniéramos', vosotros: 'vinierais', ellos: 'vinieran' }
            }
          },
          exceptions: [
            { type: 'affirmative command', pronoun: 'tú', word: 'ven' }
          ]
        },
        english: { word: 'to come', pos: 'verb', as_in: 'to arrive at a place' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000058',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'pensar',
          pos: 'verb',
          as_in: 'to have in one\'s mind',
          conjugations: {
            indicative: {
              present: { yo: 'p((ie))nso', tu: 'p((ie))nsas', el: 'p((ie))nsa', nosotros: 'pensamos', vosotros: 'pensáis', ellos: 'p((ie))nsan' },
              preterite: { yo: 'pensé', tu: 'pensaste', el: 'pensó', nosotros: 'pensamos', vosotros: 'pensasteis', ellos: 'pensaron' },
              imperfect: { yo: 'pensaba', tu: 'pensabas', el: 'pensaba', nosotros: 'pensábamos', vosotros: 'pensabais', ellos: 'pensaban' }
            },
            subjunctive: {
              present: { yo: 'p((ie))nse', tu: 'p((ie))nses', el: 'p((ie))nse', nosotros: 'pensemos', vosotros: 'penséis', ellos: 'p((ie))nsen' },
              imperfect: { yo: 'pensara', tu: 'pensaras', el: 'pensara', nosotros: 'pensáramos', vosotros: 'pensarais', ellos: 'pensaran' }
            }
          }
        },
        english: { word: 'to think', pos: 'verb', as_in: 'to have in one\'s mind' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000059',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'dormir',
          pos: 'verb',
          as_in: 'to be asleep',
          conjugations: {
            indicative: {
              present: { yo: 'd((ue))rmo', tu: 'd((ue))rmes', el: 'd((ue))rme', nosotros: 'dormimos', vosotros: 'dormís', ellos: 'd((ue))rmen' },
              preterite: { yo: 'dormí', tu: 'dormiste', el: 'd(u)rmió', nosotros: 'dormimos', vosotros: 'dormisteis', ellos: 'd(u)rmieron' },
              imperfect: { yo: 'dormía', tu: 'dormías', el: 'dormía', nosotros: 'dormíamos', vosotros: 'dormíais', ellos: 'dormían' }
            },
            subjunctive: {
              present: { yo: 'd((ue))rma', tu: 'd((ue))rmas', el: 'd((ue))rma', nosotros: 'd(u)rmamos', vosotros: 'd(u)rmáis', ellos: 'd((ue))rman' },
              imperfect: { yo: 'd(u)rmiera', tu: 'd(u)rmieras', el: 'd(u)rmiera', nosotros: 'd(u)rmiéramos', vosotros: 'd(u)rmierais', ellos: 'd(u)rmieran' }
            }
          }
        },
        english: { word: 'to sleep', pos: 'verb', as_in: 'to be asleep' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000060',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'jugar',
          pos: 'verb',
          as_in: 'to play a game or sport',
          conjugations: {
            indicative: {
              present: { yo: 'j((ue))go', tu: 'j((ue))gas', el: 'j((ue))ga', nosotros: 'jugamos', vosotros: 'jugáis', ellos: 'j((ue))gan' },
              preterite: { yo: 'ju(gu)é', tu: 'jugaste', el: 'jugó', nosotros: 'jugamos', vosotros: 'jugasteis', ellos: 'jugaron' },
              imperfect: { yo: 'jugaba', tu: 'jugabas', el: 'jugaba', nosotros: 'jugábamos', vosotros: 'jugabais', ellos: 'jugaban' }
            },
            subjunctive: {
              present: { yo: 'j((ue))gue', tu: 'j((ue))gues', el: 'j((ue))gue', nosotros: 'juguemos', vosotros: 'juguéis', ellos: 'j((ue))guen' },
              imperfect: { yo: 'jugara', tu: 'jugaras', el: 'jugara', nosotros: 'jugáramos', vosotros: 'jugarais', ellos: 'jugaran' }
            }
          }
        },
        english: { word: 'to play', pos: 'verb', as_in: 'a game or sport' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000061',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'sentir',
          pos: 'verb',
          as_in: 'to feel an emotion',
          conjugations: {
            indicative: {
              present: { yo: 's((ie))nto', tu: 's((ie))ntes', el: 's((ie))nte', nosotros: 'sentimos', vosotros: 'sentís', ellos: 's((ie))nten' },
              preterite: { yo: 'sentí', tu: 'sentiste', el: 's(i)ntió', nosotros: 'sentimos', vosotros: 'sentisteis', ellos: 's(i)ntieron' },
              imperfect: { yo: 'sentía', tu: 'sentías', el: 'sentía', nosotros: 'sentíamos', vosotros: 'sentíais', ellos: 'sentían' }
            },
            subjunctive: {
              present: { yo: 's((ie))nta', tu: 's((ie))ntas', el: 's((ie))nta', nosotros: 's(i)ntamos', vosotros: 's(i)ntáis', ellos: 's((ie))ntan' },
              imperfect: { yo: 's(i)ntiera', tu: 's(i)ntieras', el: 's(i)ntiera', nosotros: 's(i)ntiéramos', vosotros: 's(i)ntierais', ellos: 's(i)ntieran' }
            }
          }
        },
        english: { word: 'to feel', pos: 'verb', as_in: 'an emotion' }
      },
      {
        spanish: {
          word: 'sentir',
          pos: 'verb',
          as_in: 'to be sorry'
        },
        english: { word: 'to be sorry', pos: 'verb', as_in: 'to regret' },
        note: '`Lo siento` literally means "I feel it", but is used to say "I\'m sorry".'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000062',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'pedir',
          pos: 'verb',
          as_in: 'to request something',
          conjugations: {
            indicative: {
              present: { yo: 'p((i))do', tu: 'p((i))des', el: 'p((i))de', nosotros: 'pedimos', vosotros: 'pedís', ellos: 'p((i))den' },
              preterite: { yo: 'pedí', tu: 'pediste', el: 'p(i)dió', nosotros: 'pedimos', vosotros: 'pedisteis', ellos: 'p(i)dieron' },
              imperfect: { yo: 'pedía', tu: 'pedías', el: 'pedía', nosotros: 'pedíamos', vosotros: 'pedíais', ellos: 'pedían' }
            },
            subjunctive: {
              present: { yo: 'p((i))da', tu: 'p((i))das', el: 'p((i))da', nosotros: 'p((i))damos', vosotros: 'p((i))dáis', ellos: 'p((i))dan' },
              imperfect: { yo: 'p(i)diera', tu: 'p(i)dieras', el: 'p(i)diera', nosotros: 'p(i)diéramos', vosotros: 'p(i)dierais', ellos: 'p(i)dieran' }
            }
          }
        },
        english: { word: 'to ask for', pos: 'verb', as_in: 'to request something' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000063',
    starred: false,
    meanings: [
      {
        spanish: { word: 'bueno', pos: 'adjective', as_in: 'of high quality', gender_map: { 'bueno': 'm', 'buena': 'f' } },
        english: { word: 'good', pos: 'adjective', as_in: 'of high quality' },
        note: 'When placed before a masculine singular noun, `bueno` shortens to `buen` (e.g., `un buen día`).'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000064',
    starred: false,
    meanings: [
      {
        spanish: { word: 'malo', pos: 'adjective', as_in: 'of low quality', gender_map: { 'malo': 'm', 'mala': 'f' } },
        english: { word: 'bad', pos: 'adjective', as_in: 'of low quality' },
        note: 'When placed before a masculine singular noun, `malo` shortens to `mal` (e.g., `un mal día`).'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000065',
    starred: false,
    meanings: [
      {
        spanish: { word: 'joven', pos: 'adjective', as_in: 'not old', gender_map: { 'joven': 'n' } },
        english: { word: 'young', pos: 'adjective', as_in: 'not old' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000066',
    starred: false,
    meanings: [
      {
        spanish: { word: 'feliz', pos: 'adjective', as_in: 'feeling pleasure', gender_map: { 'feliz': 'n' } },
        english: { word: 'happy', pos: 'adjective', as_in: 'feeling pleasure' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000067',
    starred: false,
    meanings: [
      {
        spanish: { word: 'fácil', pos: 'adjective', as_in: 'not difficult', gender_map: { 'fácil': 'n' } },
        english: { word: 'easy', pos: 'adjective', as_in: 'not difficult' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000068',
    starred: false,
    meanings: [
      {
        spanish: { word: 'difícil', pos: 'adjective', as_in: 'not easy', gender_map: { 'difícil': 'n' } },
        english: { word: 'difficult', pos: 'adjective', as_in: 'not easy' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000069',
    starred: false,
    meanings: [
      {
        spanish: { word: 'otro', pos: 'adjective', as_in: 'different or additional', gender_map: { 'otro': 'm', 'otra': 'f' } },
        english: { word: 'other', pos: 'adjective', as_in: 'different or additional' }
      },
      {
        spanish: { word: 'otro', pos: 'adjective', as_in: 'one more' },
        english: { word: 'another', pos: 'adjective', as_in: 'one more' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000070',
    starred: false,
    meanings: [
      {
        spanish: { word: 'mucho', pos: 'adjective', as_in: 'a large amount of', gender_map: { 'mucho': 'm', 'mucha': 'f' } },
        english: { word: 'much', pos: 'adjective', as_in: 'a large amount of' }
      },
       {
        spanish: { word: 'mucho', pos: 'adverb', as_in: 'to a great extent' },
        english: { word: 'a lot', pos: 'adverb', as_in: 'to a great extent' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000071',
    starred: false,
    meanings: [
      {
        spanish: { word: 'poco', pos: 'adjective', as_in: 'a small amount of', gender_map: { 'poco': 'm', 'poca': 'f' } },
        english: { word: 'little', pos: 'adjective', as_in: 'a small amount of' }
      },
       {
        spanish: { word: 'poco', pos: 'adverb', as_in: 'to a small extent' },
        english: { word: 'a little', pos: 'adverb', as_in: 'to a small extent' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000072',
    starred: false,
    meanings: [
      {
        spanish: { word: 'guay', pos: 'adjective', as_in: 'excellent or attractive', region: 'SPAIN', tags: ['COLLOQUIAL'] },
        english: { word: 'cool', pos: 'adjective', as_in: 'excellent or attractive' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000073',
    starred: true,
    meanings: [
      {
        spanish: { word: 'listo', pos: 'adjective', as_in: 'prepared for something', gender_map: { 'listo': 'm', 'lista': 'f' } },
        english: { word: 'ready', pos: 'adjective', as_in: 'prepared for something' },
        note: 'This meaning is often used with the verb `estar` (e.g., `estoy listo`).'
      },
       {
        spanish: { word: 'listo', pos: 'adjective', as_in: 'intelligent', gender_map: { 'listo': 'm', 'lista': 'f' } },
        english: { word: 'clever', pos: 'adjective', as_in: 'intelligent' },
        note: 'This meaning is often used with the verb `ser` (e.g., `es muy lista`).'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000074',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'buscar',
          pos: 'verb',
          as_in: 'to try to find',
          conjugations: {
            indicative: {
              present: { yo: 'busco', tu: 'buscas', el: 'busca', nosotros: 'buscamos', vosotros: 'buscáis', ellos: 'buscan' },
              preterite: { yo: 'bus(qu)é', tu: 'buscaste', el: 'buscó', nosotros: 'buscamos', vosotros: 'buscasteis', ellos: 'buscaron' },
              imperfect: { yo: 'buscaba', tu: 'buscabas', el: 'buscaba', nosotros: 'buscábamos', vosotros: 'buscabais', ellos: 'buscaban' }
            },
            subjunctive: {
              present: { yo: 'bus(qu)e', tu: 'bus(qu)es', el: 'bus(qu)e', nosotros: 'bus(qu)emos', vosotros: 'bus(qu)éis', ellos: 'bus(qu)en' },
              imperfect: { yo: 'buscara', tu: 'buscaras', el: 'buscara', nosotros: 'buscáramos', vosotros: 'buscarais', ellos: 'buscaran' }
            }
          }
        },
        english: { word: 'to look for', pos: 'verb', as_in: 'to try to find' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000075',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'encontrar',
          pos: 'verb',
          as_in: 'to discover something',
          conjugations: {
            indicative: {
              present: { yo: 'enc((ue))ntro', tu: 'enc((ue))ntras', el: 'enc((ue))ntra', nosotros: 'encontramos', vosotros: 'encontráis', ellos: 'enc((ue))ntran' },
              preterite: { yo: 'encontré', tu: 'encontraste', el: 'encontró', nosotros: 'encontramos', vosotros: 'encontrasteis', ellos: 'encontraron' },
              imperfect: { yo: 'encontraba', tu: 'encontrabas', el: 'encontraba', nosotros: 'encontrábamos', vosotros: 'encontrabais', ellos: 'encontraban' }
            },
            subjunctive: {
              present: { yo: 'enc((ue))ntre', tu: 'enc((ue))ntres', el: 'enc((ue))ntre', nosotros: 'encontremos', vosotros: 'encontréis', ellos: 'enc((ue))ntren' },
              imperfect: { yo: 'encontrara', tu: 'encontraras', el: 'encontrara', nosotros: 'encontráramos', vosotros: 'encontrarais', ellos: 'encontraran' }
            }
          }
        },
        english: { word: 'to find', pos: 'verb', as_in: 'to discover something' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000076',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'coger',
          pos: 'verb',
          as_in: 'to take or to catch',
          region: 'SPAIN',
          conjugations: {
            indicative: {
              present: { yo: 'co(j)o', tu: 'coges', el: 'coge', nosotros: 'cogemos', vosotros: 'cogéis', ellos: 'cogen' },
              preterite: { yo: 'cogí', tu: 'cogiste', el: 'cogió', nosotros: 'cogimos', vosotros: 'cogisteis', ellos: 'cogieron' },
              imperfect: { yo: 'cogía', tu: 'cogías', el: 'cogía', nosotros: 'cogíamos', vosotros: 'cogíais', ellos: 'cogían' }
            },
            subjunctive: {
              present: { yo: 'co(j)a', tu: 'co(j)as', el: 'co(j)a', nosotros: 'co(j)amos', vosotros: 'co(j)áis', ellos: 'co(j)an' },
              imperfect: { yo: 'cogiera', tu: 'cogieras', el: 'cogiera', nosotros: 'cogiéramos', vosotros: 'cogierais', ellos: 'cogieran' }
            }
          }
        },
        english: { word: 'to take', pos: 'verb', as_in: 'to grab' },
        note: 'Be careful! In many parts of Latin America, `coger` is a vulgar term for sexual intercourse. `Tomar` or `agarrar` are safer alternatives.'
      },
      {
        spanish: {
          word: 'coger',
          pos: 'verb',
          as_in: 'to have sexual intercourse',
          region: 'LATAM',
          tags: ['VULGAR']
        },
        english: { word: 'to fuck', pos: 'verb', as_in: 'to have sexual intercourse' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000077',
    starred: false,
    meanings: [
      {
        spanish: { word: 'ojo', pos: 'noun', as_in: 'the organ of sight', gender_map: { 'ojo': 'm' } },
        english: { word: 'eye', pos: 'noun', as_in: 'the organ of sight' }
      },
      {
        spanish: { word: '¡Ojo!', pos: 'adverb', as_in: 'an expression of warning' },
        english: { word: 'Watch out!', pos: 'adverb', as_in: 'an expression of warning' },
        note: 'Used as an interjection, `¡Ojo!` means "Be careful!" or "Look out!".'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000078',
    starred: false,
    meanings: [
      {
        spanish: { word: 'salud', pos: 'noun', as_in: 'physical well-being', gender_map: { 'salud': 'f' } },
        english: { word: 'health', pos: 'noun', as_in: 'physical well-being' }
      },
      {
        spanish: { word: '¡Salud!', pos: 'adverb', as_in: 'a toast' },
        english: { word: 'Cheers!', pos: 'adverb', as_in: 'a toast' },
        note: 'Also said after someone sneezes, like "Bless you!".'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000079',
    starred: false,
    meanings: [
      {
        spanish: { word: 'dinero', pos: 'noun', as_in: 'money', gender_map: { 'dinero': 'm' } },
        english: { word: 'money', pos: 'noun', as_in: 'currency' }
      },
      {
        spanish: { word: 'plata', pos: 'noun', as_in: 'money', region: 'LATAM', tags: ['COLLOQUIAL'], gender_map: { 'plata': 'f' } },
        english: { word: 'money', pos: 'noun', as_in: 'currency' },
        note: '`Plata` literally means silver, but it is a very common colloquial term for money in Latin America.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000080',
    starred: false,
    meanings: [
      {
        spanish: { word: 'ahora', pos: 'adverb', as_in: 'at the present time' },
        english: { word: 'now', pos: 'adverb', as_in: 'at the present time' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000081',
    starred: false,
    meanings: [
      {
        spanish: { word: 'siempre', pos: 'adverb', as_in: 'at all times' },
        english: { word: 'always', pos: 'adverb', as_in: 'at all times' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000082',
    starred: false,
    meanings: [
      {
        spanish: { word: 'nunca', pos: 'adverb', as_in: 'at no time' },
        english: { word: 'never', pos: 'adverb', as_in: 'at no time' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000083',
    starred: false,
    meanings: [
      {
        spanish: { word: 'también', pos: 'adverb', as_in: 'in addition' },
        english: { word: 'also', pos: 'adverb', as_in: 'in addition' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000084',
    starred: false,
    meanings: [
      {
        spanish: { word: 'tampoco', pos: 'adverb', as_in: 'in addition, in the negative' },
        english: { word: 'neither', pos: 'adverb', as_in: 'not either' },
        note: '`Tampoco` is the negative counterpart to `también`.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000085',
    starred: true,
    grand_note: {
        title: "Por qué, porque, porqué, por que",
        description: "These four forms are often confused. `¿Por qué?` is 'Why?'. `Porque` is 'Because'. `El porqué` is 'The reason'. `Por que` (two words, no accent) is less common and means 'for which'."
    },
    meanings: [
      {
        spanish: {
          word: '¿por qué?',
          pos: 'adverb',
          as_in: 'asking for a reason'
        },
        english: { word: 'why?', pos: 'adverb', as_in: 'for what reason' }
      },
      {
        spanish: {
          word: 'porque',
          pos: 'adverb',
          as_in: 'giving a reason'
        },
        english: { word: 'because', pos: 'adverb', as_in: 'for the reason that' }
      },
      {
        spanish: {
          word: 'el porqué',
          pos: 'noun',
          as_in: 'the reason itself',
          gender_map: { 'porqué': 'm' }
        },
        english: { word: 'the reason', pos: 'noun', as_in: 'the cause' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000086',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'resaca',
          pos: 'noun',
          as_in: 'after drinking alcohol',
          gender_map: { 'resaca': 'f' }
        },
        english: { word: 'hangover', pos: 'noun', as_in: 'after drinking alcohol' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000087',
    starred: true,
    meanings: [
      {
        spanish: {
          word: 'sobremesa',
          pos: 'noun',
          as_in: 'conversation after a meal',
          gender_map: { 'sobremesa': 'f' }
        },
        english: { word: 'after-dinner conversation', pos: 'noun', as_in: 'chatting at the table' },
        note: 'A culturally significant Spanish word for the time spent relaxing and chatting at the table after a meal is finished.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000088',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'estadounidense',
          pos: 'adjective',
          as_in: 'from the United States',
          gender_map: { 'estadounidense': 'n' }
        },
        english: { word: 'American', pos: 'adjective', as_in: 'from the United States' },
        note: 'While `americano` is often used, `estadounidense` is more specific to the USA, as `americano` can refer to anyone from the Americas.'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000089',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'poner',
          pos: 'verb',
          as_in: 'to place something',
          conjugations: {
            indicative: {
              present: { yo: 'pon(go)', tu: 'pones', el: 'pone', nosotros: 'ponemos', vosotros: 'ponéis', ellos: 'ponen' },
              preterite: { yo: 'puse', tu: 'pusiste', el: 'puso', nosotros: 'pusimos', vosotros: 'pusisteis', ellos: 'pusieron' },
              imperfect: { yo: 'ponía', tu: 'ponías', el: 'ponía', nosotros: 'poníamos', vosotros: 'poníais', ellos: 'ponían' }
            },
            subjunctive: {
              present: { yo: 'ponga', tu: 'pongas', el: 'ponga', nosotros: 'pongamos', vosotros: 'pongáis', ellos: 'pongan' },
              imperfect: { yo: 'pusiera', tu: 'pusieras', el: 'pusiera', nosotros: 'pusiéramos', vosotros: 'pusierais', ellos: 'pusieran' }
            }
          },
          exceptions: [
            { type: 'affirmative command', pronoun: 'tú', word: 'pon' }
          ]
        },
        english: { word: 'to put', pos: 'verb', as_in: 'to place something' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000090',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'cerrar',
          pos: 'verb',
          as_in: 'to close something',
          conjugations: {
            indicative: {
              present: { yo: 'c((ie))rro', tu: 'c((ie))rras', el: 'c((ie))rra', nosotros: 'cerramos', vosotros: 'cerráis', ellos: 'c((ie))rran' },
              preterite: { yo: 'cerré', tu: 'cerraste', el: 'cerró', nosotros: 'cerramos', vosotros: 'cerrasteis', ellos: 'cerraron' },
              imperfect: { yo: 'cerraba', tu: 'cerrabas', el: 'cerraba', nosotros: 'cerrábamos', vosotros: 'cerrabais', ellos: 'cerraban' }
            },
            subjunctive: {
              present: { yo: 'c((ie))rre', tu: 'c((ie))rres', el: 'c((ie))rre', nosotros: 'cerremos', vosotros: 'cerréis', ellos: 'c((ie))rren' },
              imperfect: { yo: 'cerrara', tu: 'cerraras', el: 'cerrara', nosotros: 'cerráramos', vosotros: 'cerrarais', ellos: 'cerraran' }
            }
          }
        },
        english: { word: 'to close', pos: 'verb', as_in: 'to shut something' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000091',
    starred: false,
    meanings: [
      {
        spanish: { word: 'silla', pos: 'noun', as_in: 'a seat for one person', gender_map: { 'silla': 'f' } },
        english: { word: 'chair', pos: 'noun', as_in: 'a seat for one person' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000092',
    starred: false,
    meanings: [
      {
        spanish: { word: 'mesa', pos: 'noun', as_in: 'a piece of furniture with a flat top', gender_map: { 'mesa': 'f' } },
        english: { word: 'table', pos: 'noun', as_in: 'a piece of furniture with a flat top' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000093',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'hablar',
          pos: 'verb',
          as_in: 'to say words',
          conjugations: {
            indicative: {
              present: { yo: 'hablo', tu: 'hablas', el: 'habla', nosotros: 'hablamos', vosotros: 'habláis', ellos: 'hablan' },
              preterite: { yo: 'hablé', tu: 'hablaste', el: 'habló', nosotros: 'hablamos', vosotros: 'hablasteis', ellos: 'hablaron' },
              imperfect: { yo: 'hablaba', tu: 'hablabas', el: 'hablaba', nosotros: 'hablábamos', vosotros: 'hablabais', ellos: 'hablaban' }
            },
            subjunctive: {
              present: { yo: 'hable', tu: 'hables', el: 'hable', nosotros: 'hablemos', vosotros: 'habléis', ellos: 'hablen' },
              imperfect: { yo: 'hablara', tu: 'hablaras', el: 'hablara', nosotros: 'habláramos', vosotros: 'hablarais', ellos: 'hablaran' }
            }
          }
        },
        english: { word: 'to speak', pos: 'verb', as_in: 'to say words' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000094',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'escribir',
          pos: 'verb',
          as_in: 'to mark letters or symbols on a surface',
          conjugations: {
            indicative: {
              present: { yo: 'escribo', tu: 'escribes', el: 'escribe', nosotros: 'escribimos', vosotros: 'escribís', ellos: 'escriben' },
              preterite: { yo: 'escribí', tu: 'escribiste', el: 'escribió', nosotros: 'escribimos', vosotros: 'escribisteis', ellos: 'escribieron' },
              imperfect: { yo: 'escribía', tu: 'escribías', el: 'escribía', nosotros: 'escribíamos', vosotros: 'escribíais', ellos: 'escribían' }
            },
            subjunctive: {
              present: { yo: 'escriba', tu: 'escribas', el: 'escriba', nosotros: 'escribamos', vosotros: 'escribáis', ellos: 'escriban' },
              imperfect: { yo: 'escribiera', tu: 'escribieras', el: 'escribiera', nosotros: 'escribiéramos', vosotros: 'escribierais', ellos: 'escribieran' }
            }
          }
        },
        english: { word: 'to write', pos: 'verb', as_in: 'to mark letters or symbols on a surface' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000095',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'abrir',
          pos: 'verb',
          as_in: 'to move something so it is no longer closed',
          conjugations: {
            indicative: {
              present: { yo: 'abro', tu: 'abres', el: 'abre', nosotros: 'abrimos', vosotros: 'abrís', ellos: 'abren' },
              preterite: { yo: 'abrí', tu: 'abriste', el: 'abrió', nosotros: 'abrimos', vosotros: 'abristeis', ellos: 'abrieron' },
              imperfect: { yo: 'abría', tu: 'abrías', el: 'abría', nosotros: 'abríamos', vosotros: 'abríais', ellos: 'abrían' }
            },
            subjunctive: {
              present: { yo: 'abra', tu: 'abras', el: 'abra', nosotros: 'abramos', vosotros: 'abráis', ellos: 'abran' },
              imperfect: { yo: 'abriera', tu: 'abrieras', el: 'abriera', nosotros: 'abriéramos', vosotros: 'abrierais', ellos: 'abrieran' }
            }
          }
        },
        english: { word: 'to open', pos: 'verb', as_in: 'to move something so it is no longer closed' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000096',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'salir',
          pos: 'verb',
          as_in: 'to go out of or leave a place',
          conjugations: {
            indicative: {
              present: { yo: 'sal(go)', tu: 'sales', el: 'sale', nosotros: 'salimos', vosotros: 'salís', ellos: 'salen' },
              preterite: { yo: 'salí', tu: 'saliste', el: 'salió', nosotros: 'salimos', vosotros: 'salisteis', ellos: 'salieron' },
              imperfect: { yo: 'salía', tu: 'salías', el: 'salía', nosotros: 'salíamos', vosotros: 'salíais', ellos: 'salían' }
            },
            subjunctive: {
              present: { yo: 'salga', tu: 'salgas', el: 'salga', nosotros: 'salgamos', vosotros: 'salgáis', ellos: 'salgan' },
              imperfect: { yo: 'saliera', tu: 'salieras', el: 'saliera', nosotros: 'saliéramos', vosotros: 'salierais', ellos: 'salieran' }
            }
          },
          exceptions: [
            { type: 'affirmative command', pronoun: 'tú', word: 'sal' }
          ]
        },
        english: { word: 'to leave', pos: 'verb', as_in: 'to go out of a place' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000097',
    starred: false,
    meanings: [
      {
        spanish: { word: 'sueño', pos: 'noun', as_in: 'a series of thoughts or images during sleep', gender_map: { 'sueño': 'm' } },
        english: { word: 'dream', pos: 'noun', as_in: 'a series of thoughts during sleep' }
      },
      {
        spanish: { word: 'sueño', pos: 'noun', as_in: 'the state of being tired', gender_map: { 'sueño': 'm' } },
        english: { word: 'sleepiness', pos: 'noun', as_in: 'the state of being tired' },
        note: 'Used with `tener`: `Tengo sueño` means "I am sleepy".'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000098',
    starred: false,
    meanings: [
      {
        spanish: { word: 'frío', pos: 'noun', as_in: 'low temperature', gender_map: { 'frío': 'm' } },
        english: { word: 'cold', pos: 'noun', as_in: 'low temperature' },
        note: 'Used with `hacer` for weather (`hace frío`) and `tener` for feeling (`tengo frío`).'
      },
      {
        spanish: { word: 'frío', pos: 'adjective', as_in: 'being at a low temperature', gender_map: { 'frío': 'm', 'fría': 'f' } },
        english: { word: 'cold', pos: 'adjective', as_in: 'being at a low temperature' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000099',
    starred: false,
    meanings: [
      {
        spanish: { word: 'calor', pos: 'noun', as_in: 'high temperature', gender_map: { 'calor': 'm' } },
        english: { word: 'heat', pos: 'noun', as_in: 'high temperature' },
        note: 'Used with `hacer` for weather (`hace calor`) and `tener` for feeling (`tengo calor`).'
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000100',
    starred: false,
    meanings: [
      {
        spanish: { word: 'nuevo', pos: 'adjective', as_in: 'not existing before', gender_map: { 'nuevo': 'm', 'nueva': 'f' } },
        english: { word: 'new', pos: 'adjective', as_in: 'not existing before' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000101',
    starred: false,
    meanings: [
      {
        spanish: { word: 'pequeño', pos: 'adjective', as_in: 'of a size that is less than normal', gender_map: { 'pequeño': 'm', 'pequeña': 'f' } },
        english: { word: 'small', pos: 'adjective', as_in: 'of a size that is less than normal' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000102',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'correr',
          pos: 'verb',
          as_in: 'to move at a speed faster than a walk',
          conjugations: {
            indicative: {
              present: { yo: 'corro', tu: 'corres', el: 'corre', nosotros: 'corremos', vosotros: 'corréis', ellos: 'corren' },
              preterite: { yo: 'corrí', tu: 'corriste', el: 'corrió', nosotros: 'corrimos', vosotros: 'corristeis', ellos: 'corrieron' },
              imperfect: { yo: 'corría', tu: 'corrías', el: 'corría', nosotros: 'corríamos', vosotros: 'corríais', ellos: 'corrían' }
            },
            subjunctive: {
              present: { yo: 'corra', tu: 'corras', el: 'corra', nosotros: 'corramos', vosotros: 'corráis', ellos: 'corran' },
              imperfect: { yo: 'corriera', tu: 'corrieras', el: 'corriera', nosotros: 'corriéramos', vosotros: 'corrierais', ellos: 'corrieran' }
            }
          }
        },
        english: { word: 'to run', pos: 'verb', as_in: 'to move at a speed faster than a walk' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000103',
    starred: false,
    meanings: [
      {
        spanish: {
          word: 'leer',
          pos: 'verb',
          as_in: 'to look at and comprehend written material',
          conjugations: {
            indicative: {
              present: { yo: 'leo', tu: 'lees', el: 'lee', nosotros: 'leemos', vosotros: 'leéis', ellos: 'leen' },
              preterite: { yo: 'leí', tu: 'leíste', el: '(leyó)', nosotros: 'leímos', vosotros: 'leísteis', ellos: '(leyeron)' },
              imperfect: { yo: 'leía', tu: 'leías', el: 'leía', nosotros: 'leíamos', vosotros: 'leíais', ellos: 'leían' }
            },
            subjunctive: {
              present: { yo: 'lea', tu: 'leas', el: 'lea', nosotros: 'leamos', vosotros: 'leáis', ellos: 'lean' },
              imperfect: { yo: 'leyera', tu: 'leyeras', el: 'leyera', nosotros: 'leyéramos', vosotros: 'leyerais', ellos: 'leyeran' }
            }
          }
        },
        english: { word: 'to read', pos: 'verb', as_in: 'to look at and comprehend written material' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000104',
    starred: false,
    meanings: [
      {
        spanish: { word: 'llave', pos: 'noun', as_in: 'a small piece of shaped metal for operating a lock', gender_map: { 'llave': 'f' } },
        english: { word: 'key', pos: 'noun', as_in: 'a small piece of shaped metal for operating a lock' }
      }
    ],
    related_spanish: [],
    related_english: []
  },
  {
    id: '000105',
    starred: false,
    meanings: [
      {
        spanish: { word: 'puerta', pos: 'noun', as_in: 'a hinged barrier at the entrance to a room or building', gender_map: { 'puerta': 'f' } },
        english: { word: 'door', pos: 'noun', as_in: 'a hinged barrier at the entrance to a room or building' }
      }
    ],
    related_spanish: [],
    related_english: []
  }
];