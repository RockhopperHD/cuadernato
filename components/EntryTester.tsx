import React, { useMemo, useState } from 'react';
import { DictionaryEntry } from '../types';
import { WordDetails } from './WordDetails';
import { BackIcon } from './icons';

type EntryTesterProps = {
  dictionaryData: DictionaryEntry[];
  onBack: () => void;
};

type ParseResult = {
  entry: DictionaryEntry | null;
  error: string | null;
};

const validateEntry = (value: unknown): ParseResult => {
  if (!value || typeof value !== 'object') {
    return { entry: null, error: 'The JSON must describe an object.' };
  }

  const candidate = value as Partial<DictionaryEntry>;

  if (typeof candidate.id !== 'string' || candidate.id.trim() === '') {
    return { entry: null, error: 'An entry needs a non-empty string "id" field.' };
  }

  if (typeof candidate.starred !== 'boolean') {
    return { entry: null, error: 'An entry must include a boolean "starred" field.' };
  }

  if (!Array.isArray(candidate.meanings) || candidate.meanings.length === 0) {
    return { entry: null, error: 'An entry must include at least one meaning.' };
  }

  const hasInvalidMeaning = candidate.meanings.some(meaning => {
    if (!meaning || typeof meaning !== 'object') {
      return true;
    }

    const { spanish, english, pos, as_in } = meaning as any;

    if (!spanish || typeof spanish !== 'object' || typeof spanish.word !== 'string') {
      return true;
    }

    if (!english || typeof english !== 'object' || typeof english.word !== 'string') {
      return true;
    }

    if (typeof pos !== 'string' || typeof as_in !== 'string') {
      return true;
    }

    return false;
  });

  if (hasInvalidMeaning) {
    return { entry: null, error: 'Each meaning must include "spanish", "english", "pos", and "as_in" fields.' };
  }

  return { entry: candidate as DictionaryEntry, error: null };
};

export const EntryTester: React.FC<EntryTesterProps> = ({ dictionaryData, onBack }) => {
  const [entryText, setEntryText] = useState(() => {
    if (dictionaryData.length === 0) {
      return '{\n  "id": "",\n  "starred": false,\n  "meanings": []\n}';
    }

    return JSON.stringify(dictionaryData[0], null, 2);
  });
  const [dictionaryLookupId, setDictionaryLookupId] = useState('');
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);
  const [lang, setLang] = useState<'ES' | 'EN'>('EN');

  const parseResult = useMemo<ParseResult>(() => {
    try {
      const parsed = JSON.parse(entryText);
      return validateEntry(parsed);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { entry: null, error: `Unable to parse JSON: ${message}` };
    }
  }, [entryText]);

  const matchedDictionaryEntry = useMemo(() => {
    if (!parseResult.entry) {
      return null;
    }

    return dictionaryData.find(entry => entry.id === parseResult.entry?.id) ?? null;
  }, [dictionaryData, parseResult.entry]);

  const handleLookup = () => {
    const trimmed = dictionaryLookupId.trim();
    if (!trimmed) {
      setLookupFeedback('Enter an entry id to load.');
      return;
    }

    const existing = dictionaryData.find(entry => entry.id === trimmed);
    if (!existing) {
      setLookupFeedback(`No dictionary entry found with id ${trimmed}.`);
      return;
    }

    setEntryText(JSON.stringify(existing, null, 2));
    setLookupFeedback(`Loaded entry ${trimmed} from the dictionary.`);
  };

  const renderFeedback = () => {
    if (lookupFeedback) {
      return (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2" role="status">
          {lookupFeedback}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <BackIcon className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Preview Language:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setLang('EN')}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
                  lang === 'EN'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('ES')}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
                  lang === 'ES'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Spanish
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold">Dictionary Entry JSON</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Paste or edit a dictionary entry. Use the loader below to pull an existing entry by id.
              </p>
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <label className="flex-1 text-sm">
                  <span className="sr-only">Entry id</span>
                  <input
                    type="text"
                    value={dictionaryLookupId}
                    onChange={event => setDictionaryLookupId(event.target.value)}
                    placeholder="Entry id (e.g. 000001)"
                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
                <button
                  onClick={handleLookup}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
                >
                  Load from dictionary
                </button>
              </div>
              {renderFeedback()}
            </div>
            <textarea
              value={entryText}
              onChange={event => {
                setEntryText(event.target.value);
                setLookupFeedback(null);
              }}
              className="flex-1 w-full min-h-[24rem] resize-none font-mono text-sm px-5 py-4 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              spellCheck={false}
            />
          </section>

          <section className="flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold">Rendered Preview</h2>
              {parseResult.error ? (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{parseResult.error}</p>
              ) : matchedDictionaryEntry ? (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                  Entry id {parseResult.entry?.id} exists in the dictionary.
                </p>
              ) : (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  Entry id {parseResult.entry?.id} was not found in the loaded dictionary.
                </p>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {parseResult.entry ? (
                <WordDetails
                  entry={parseResult.entry}
                  lang={lang}
                  onStar={() => {}}
                  query=""
                  isWordOnList={false}
                  isListLocked={false}
                  onListIconClick={() => {}}
                  lookupEntryById={(id) => dictionaryData.find(entry => entry.id === id) ?? null}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400">
                  Provide a valid dictionary entry JSON to preview it here.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
