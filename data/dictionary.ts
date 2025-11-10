import { DictionaryEntry } from '../types';

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    id: '1',
    starred: false,
    meanings: [
      {
        pos: 'verb',
        as_in: 'you have an object',
        spanish: {
          word: 'tener',
          note: "Using 'que' after 'tener' turns it into 'have to'.",
          conj_map: {
            indicative: {
              present: {
                general: 't((ie))nX',
                exceptions: {
                  yo: 'ten(go)',
                  nosotros: 'tenemos',
                  vosotros: 'tenéis'
                }
              },
              preterite: {
                general: 't(u)vX',
                exceptions: {
                  yo: 't(u)ve',
                  tu: 't(u)viste',
                  el: 't(u)vo',
                  nosotros: 't(u)vimos',
                  vosotros: 't(u)visteis',
                  ellos: 't(u)vieron'
                }
              }
            },
            subjunctive: {
              present: {
                general: 'tengX'
              },
              imperfect: {
                general: 'tuvierX'
              }
            }
          },
          exceptions: [
            {
              type: 'affirmative command',
              pronoun: 'tú',
              word: 'ten'
            }
          ]
        },
        english: {
          word: 'to have'
        }
      }
    ]
  },
  {
    id: '2',
    starred: false,
    meanings: [
      {
        pos: 'noun',
        as_in: 'the bird',
        spanish: {
          word: 'pato',
          tags: ['GENDER-SPECIFIC'],
          gender_map: {
            pato: 'm',
            pata: 'f'
          }
        },
        english: {
          word: 'duck'
        }
      }
    ],
    related_spanish: ['3']
  },
  {
    id: '3',
    starred: false,
    meanings: [
      {
        pos: 'noun',
        as_in: 'of an animal',
        spanish: {
          word: 'pata',
          gender_map: {
            pata: 'f'
          }
        },
        english: {
          word: 'paw'
        }
      },
      {
        pos: 'noun',
        as_in: 'the bird',
        spanish: {
          word: 'pata',
          tags: ['GENDER-SPECIFIC'],
          gender_map: {
            pato: 'm',
            pata: 'f'
          }
        },
        english: {
          word: 'duck'
        }
      }
    ],
    related_spanish: ['2']
  },
  {
    id: '4',
    starred: true,
    meanings: [
      {
        pos: 'verb',
        as_in: 'to clean yourself with water',
        spanish: {
          word: 'ducharse',
          tags: ['REFLEXIVE']
        },
        english: {
          word: 'to shower'
        }
      }
    ]
  },
  {
    id: '5',
    starred: true,
    grand_note: {
      title: 'Ser vs Estar',
      description:
        "'Ser' and 'Estar' both mean 'to be' but are used in different cases. 'Ser' is for permanent conditions, while 'estar' is for temporary states and location."
    },
    meanings: [
      {
        pos: 'verb',
        as_in: 'essence, identity',
        spanish: {
          word: 'ser',
          note: 'Use for permanent conditions (Description, Occupation, Nationality, Time).',
          conj_map: {
            indicative: {
              present: {
                exceptions: {
                  yo: '(soy)',
                  tu: '(eres)',
                  el: '(es)',
                  nosotros: 'somos',
                  vosotros: 'sois',
                  ellos: '(son)'
                }
              },
              preterite: {
                general: 'fuX',
                exceptions: { el: 'fue' }
              },
              imperfect: {
                general: 'erX',
                exceptions: {
                  nosotros: 'éramos'
                }
              }
            },
            subjunctive: {
              present: {
                general: 'seX'
              },
              imperfect: {
                general: 'fuerX'
              }
            }
          },
          exceptions: [
            {
              type: 'affirmative command',
              pronoun: 'tú',
              word: 'sé'
            }
          ]
        },
        english: {
          word: 'to be'
        },
        note: "Use 'ser' for permanent or lasting attributes."
      }
    ],
    related_spanish: ['6'],
    trailing_spanish: ['6']
  },
  {
    id: '6',
    starred: false,
    grand_note: {
      title: 'Ser vs Estar',
      description:
        "'Ser' and 'Estar' both mean 'to be' but are used in different cases. 'Ser' is for permanent conditions, while 'estar' is for temporary states and location."
    },
    meanings: [
      {
        pos: 'verb',
        as_in: 'location, temporary state',
        spanish: {
          word: 'estar',
          conj_map: {
            indicative: {
              present: {
                general: 'estX',
                exceptions: {
                  yo: 'est(oy)',
                  tu: 'estás',
                  el: 'está',
                  ellos: 'están'
                }
              },
              preterite: {
                general: 'estuvX'
              }
            },
            subjunctive: {
              present: {
                general: 'estX',
                exceptions: {
                  yo: 'esté',
                  tu: 'estés',
                  el: 'esté',
                  ellos: 'estén'
                }
              },
              imperfect: {
                general: 'estuvierX'
              }
            }
          }
        },
        english: {
          word: 'to be'
        },
        note: 'Use \"estar\" for temporary states and locations.'
      }
    ],
    related_spanish: ['5'],
    trailing_spanish: ['5']
  },
  {
    id: '7',
    starred: false,
    meanings: [
      {
        pos: 'adjective',
        as_in: 'not crooked or bent',
        spanish: {
          word: 'derecho',
          tags: ['GENDER-SPECIFIC'],
          gender_map: {
            derecho: 'm',
            derecha: 'f'
          }
        },
        english: {
          word: 'straight'
        }
      },
      {
        pos: 'noun',
        as_in: 'a legal or moral entitlement',
        spanish: {
          word: 'derecho',
          tags: ['GENDER-SPECIFIC'],
          gender_map: {
            derecho: 'm'
          }
        },
        english: {
          word: 'right'
        }
      },
      {
        pos: 'noun',
        as_in: 'the field of study',
        spanish: {
          word: 'derecho',
          tags: ['GENDER-SPECIFIC'],
          gender_map: {
            derecho: 'm'
          }
        },
        english: {
          word: 'law'
        }
      }
    ],
    related_spanish: ['8']
  },
  {
    id: '8',
    starred: false,
    meanings: [
      {
        pos: 'noun',
        as_in: 'the right side or direction',
        spanish: {
          word: 'derecha',
          tags: ['GENDER-SPECIFIC'],
          gender_map: {
            derecha: 'f'
          }
        },
        english: {
          word: 'right'
        }
      }
    ],
    related_spanish: ['7']
  },
  {
    id: '9',
    starred: false,
    meanings: [
      {
        pos: 'verb',
        as_in: 'to bring something to an end',
        spanish: {
          word: 'acabar'
        },
        english: {
          word: 'to finish'
        },
        note: 'Often used with "de" to mean "to have just" completed something.'
      }
    ]
  },
  {
    id: '10',
    starred: false,
    meanings: [
      {
        pos: 'verb',
        as_in: 'you are consuming food',
        spanish: {
          word: 'comer'
        },
        english: {
          word: 'to eat'
        }
      }
    ]
  },
  {
    id: '11',
    starred: false,
    meanings: [
      {
        pos: 'verb',
        as_in: 'reside or be alive',
        spanish: {
          word: 'vivir'
        },
        english: {
          word: 'to live'
        }
      }
    ]
  },
  {
    id: '12',
    starred: true,
    meanings: [
      {
        pos: 'verb',
        as_in: 'to have the ability to do something',
        spanish: {
          word: 'poder',
          conj_map: {
            indicative: {
              present: {
                general: 'p((ue))dX',
                exceptions: {
                  nosotros: 'podemos',
                  vosotros: 'podéis'
                }
              },
              preterite: {
                general: 'p(u)dX'
              }
            },
            subjunctive: {
              present: {
                general: 'p(u)edX',
                exceptions: {
                  nosotros: 'podamos',
                  vosotros: 'podáis'
                }
              }
            }
          }
        },
        english: {
          word: 'to be able to'
        }
      }
    ]
  },
  {
    id: '13',
    starred: false,
    meanings: [
      {
        pos: 'verb',
        as_in: 'to think or form an opinion',
        spanish: {
          word: 'pensar',
          conj_map: {
            indicative: {
              present: {
                general: 'p((ie))nsX',
                exceptions: {
                  nosotros: 'pensamos',
                  vosotros: 'pensáis'
                }
              }
            },
            subjunctive: {
              present: {
                general: 'p((ie))nsX',
                exceptions: {
                  nosotros: 'pensemos',
                  vosotros: 'penséis'
                }
              }
            }
          }
        },
        english: {
          word: 'to think'
        }
      }
    ]
  },
  {
    id: '14',
    starred: false,
    meanings: [
      {
        pos: 'verb',
        as_in: 'to play a sport or game',
        spanish: {
          word: 'jugar',
          conj_map: {
            indicative: {
              present: {
                general: 'j((ue))gX',
                exceptions: {
                  nosotros: 'jugamos',
                  vosotros: 'jugáis'
                }
              }
            },
            subjunctive: {
              present: {
                general: 'j((ue))gX',
                exceptions: {
                  nosotros: 'juguemos',
                  vosotros: 'juguéis'
                }
              }
            }
          }
        },
        english: {
          word: 'to play'
        }
      }
    ]
  },
  {
    id: '15',
    starred: false,
    meanings: [
      {
        pos: 'verb',
        as_in: 'to leave a place',
        spanish: {
          word: 'salir',
          conj_map: {
            indicative: {
              present: {
                exceptions: {
                  yo: 'sal(go)'
                }
              },
              preterite: {
                general: 'salX',
                exceptions: {
                  yo: 'salí',
                  el: 'salió'
                }
              }
            },
            subjunctive: {
              present: {
                general: 'salgX'
              }
            }
          }
        },
        english: {
          word: 'to leave'
        },
        note: 'Commonly used for leaving a location or going out socially.'
      }
    ]
  }
];
