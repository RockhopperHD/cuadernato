import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DictionaryEntry } from '../types';
import { BackIcon, SettingsIcon, CheckIcon } from './icons';
import { generateGeminiTip, GeminiMistake, GeminiDirection } from '../utils/gemini';

type PracticeDirection = GeminiDirection;

type WordSource = 'ACTIVE' | 'STARRED';

type PracticeCard = {
  id: string;
  entryId: string;
  prompt: string;
  displayAnswer: string;
  answers: string[];
};

type FeedbackState = {
  type: 'correct' | 'incorrect';
  message: string;
  answer: string;
  distance?: number;
};

const removeAccents = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normalizeAnswer = (value: string, requireAccents: boolean): string => {
  const trimmed = value.trim().toLowerCase();
  return requireAccents ? trimmed : removeAccents(trimmed);
};

const splitAnswers = (text: string): string[] => {
  return text
    .split(/[;,/]| or |\bor\b/gi)
    .map(part => part.trim())
    .filter(Boolean);
};

const unique = (values: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  values.forEach(value => {
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(value);
    }
  });
  return result;
};

const levenshteinDistance = (a: string, b: string): number => {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    const aChar = a[i - 1];
    for (let j = 1; j <= b.length; j += 1) {
      const bChar = b[j - 1];
      const cost = aChar === bChar ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

const evaluateAnswer = (
  typedValue: string,
  answers: string[],
  options: { requireAccents: boolean; strictSpelling: boolean }
): { isCorrect: boolean; bestAnswer: string; distance: number } => {
  const normalizedInput = normalizeAnswer(typedValue, options.requireAccents);

  let bestAnswer = answers[0] ?? '';
  let bestDistance = Number.MAX_SAFE_INTEGER;

  answers.forEach(answer => {
    const normalizedAnswer = normalizeAnswer(answer, options.requireAccents);
    const distance = levenshteinDistance(normalizedInput, normalizedAnswer);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestAnswer = answer;
    }
  });

  const tolerance = options.strictSpelling ? 2 : 0;
  const isCorrect = bestDistance <= tolerance;

  return { isCorrect, bestAnswer, distance: bestDistance };
};

const MasteryIndicator: React.FC<{ value: number }> = ({ value }) => {
  const circles = [0, 1].map(index => {
    const filled = index < value;
    const color = filled ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600';
    return <span key={index} className={`inline-block h-3 w-3 rounded-full ${color}`}></span>;
  });

  return (
    <div className="flex items-center gap-1" aria-label={`Mastery ${value} of 2`}>
      {circles}
    </div>
  );
};

const SettingsModal: React.FC<{
  open: boolean;
  strictSpelling: boolean;
  requireAccents: boolean;
  retypeOnIncorrect: boolean;
  onClose: () => void;
  onToggleStrictSpelling: () => void;
  onToggleRequireAccents: () => void;
  onToggleRetypeOnIncorrect: () => void;
}> = ({
  open,
  strictSpelling,
  requireAccents,
  retypeOnIncorrect,
  onClose,
  onToggleStrictSpelling,
  onToggleRequireAccents,
  onToggleRetypeOnIncorrect,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Session Preferences</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={strictSpelling} onChange={onToggleStrictSpelling} className="mt-1" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100 block">Strict spelling</span>
              Must land within two letters of the target answer. Perfect for catching small typos without losing momentum.
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={requireAccents} onChange={onToggleRequireAccents} className="mt-1" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100 block">Require accents</span>
              Compare answers with full accent marks. Turn this off for speed drills where you just want quick recall.
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={retypeOnIncorrect} onChange={onToggleRetypeOnIncorrect} className="mt-1" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100 block">Retype on incorrect answer</span>
              Stay with the prompt until you nail it. Great for locking in troublesome terms immediately.
            </span>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

interface VocabPracticeProps {
  dictionaryData: DictionaryEntry[];
  mastery: Record<string, number>;
  onUpdateMastery: (entryId: string, newValue: number) => void;
  onResetMastery: () => void;
  onBack: () => void;
  activeList: string[];
}

export const VocabPractice: React.FC<VocabPracticeProps> = ({
  dictionaryData,
  mastery,
  onUpdateMastery,
  onResetMastery,
  onBack,
  activeList,
}) => {
  const [direction, setDirection] = useState<PracticeDirection>('ES_TO_EN');
  const [wordSource, setWordSource] = useState<WordSource>('ACTIVE');
  const [strictSpelling, setStrictSpelling] = useState(false);
  const [requireAccents, setRequireAccents] = useState(false);
  const [retypeOnIncorrect, setRetypeOnIncorrect] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [phase, setPhase] = useState<'setup' | 'active' | 'summary'>('setup');
  const [queue, setQueue] = useState<PracticeCard[]>([]);
  const [batchSize, setBatchSize] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [correctSet, setCorrectSet] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState<GeminiMistake[]>([]);
  const [tipStatus, setTipStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tip, setTip] = useState('');
  const [batchId, setBatchId] = useState(0);
  const [accentHint, setAccentHint] = useState('');
  const [streak, setStreak] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const masteryRef = useRef(mastery);
  const activeListSet = useMemo(() => new Set(activeList), [activeList]);

  useEffect(() => {
    masteryRef.current = mastery;
  }, [mastery]);

  useEffect(() => {
    if (celebrating) {
      const timeout = window.setTimeout(() => setCelebrating(false), 600);
      return () => window.clearTimeout(timeout);
    }
  }, [celebrating]);

  const starredEntries = useMemo(
    () => dictionaryData.filter(entry => entry.starred),
    [dictionaryData]
  );

  const activeEntries = useMemo(
    () => dictionaryData.filter(entry => activeListSet.has(entry.id)),
    [dictionaryData, activeListSet]
  );

  useEffect(() => {
    if (wordSource === 'ACTIVE' && activeEntries.length === 0 && starredEntries.length > 0) {
      setWordSource('STARRED');
    } else if (wordSource === 'STARRED' && starredEntries.length === 0 && activeEntries.length > 0) {
      setWordSource('ACTIVE');
    }
  }, [wordSource, activeEntries.length, starredEntries.length]);

  const wordSourceEntries = useMemo(() => {
    if (wordSource === 'ACTIVE') {
      return activeEntries;
    }
    return starredEntries;
  }, [wordSource, activeEntries, starredEntries]);

  const practicePool = useMemo(() => {
    return wordSourceEntries.flatMap(entry =>
      entry.meanings.map((meaning, meaningIndex) => ({ entry, meaning, meaningIndex }))
    );
  }, [wordSourceEntries]);

  const buildCard = useCallback(
    (item: { entry: DictionaryEntry; meaningIndex: number }): PracticeCard => {
      const { entry, meaningIndex } = item;
      const meaning = entry.meanings[meaningIndex];
      const baseId = `${entry.id}:${meaningIndex}`;

      if (direction === 'ES_TO_EN') {
        const spanishWord = meaning.spanish.word;
        const relatedMeanings = entry.meanings.filter(m => m.spanish.word === spanishWord);
        const englishAnswers = unique([
          meaning.english.word,
          ...relatedMeanings.flatMap(m => splitAnswers(m.english.word)),
        ]);

        return {
          id: baseId,
          entryId: entry.id,
          prompt: spanishWord,
          displayAnswer: meaning.english.word,
          answers: englishAnswers.length > 0 ? englishAnswers : [meaning.english.word],
        };
      }

      const englishWord = meaning.english.word;
      const spanishForms = entry.meanings.flatMap(currentMeaning => {
        const baseForm = currentMeaning.spanish.word;
        const forms = [baseForm];
        if (currentMeaning.spanish.gender_map) {
          Object.keys(currentMeaning.spanish.gender_map).forEach(term => {
            const cleanTerm = term.split('/')[0].trim();
            if (cleanTerm) {
              forms.push(cleanTerm);
            }
          });
        }
        return forms;
      });

      const uniqueForms = unique(spanishForms);

      return {
        id: baseId,
        entryId: entry.id,
        prompt: englishWord,
        displayAnswer: meaning.spanish.word,
        answers: uniqueForms.length > 0 ? uniqueForms : [meaning.spanish.word],
      };
    },
    [direction]
  );

  const resetSessionState = useCallback(() => {
    setQueue([]);
    setBatchSize(0);
    setUserInput('');
    setFeedback(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCorrectSet(new Set());
    setMistakes([]);
    setTip('');
    setTipStatus('idle');
    setAccentHint('');
    setStreak(0);
    setCelebrating(false);
  }, []);

  const initializeBatch = useCallback(() => {
    if (practicePool.length === 0) {
      resetSessionState();
      setPhase('setup');
      return;
    }

    const masteryMap = masteryRef.current;
    const unmastered = practicePool.filter(item => (masteryMap[item.entry.id] ?? 0) < 2);
    const remainder = practicePool.filter(item => (masteryMap[item.entry.id] ?? 0) >= 2);
    const pool = [...unmastered, ...remainder];

    const selection: PracticeCard[] = [];
    const seenIds = new Set<string>();
    const working = [...pool];

    while (selection.length < 5 && working.length > 0) {
      const index = Math.floor(Math.random() * working.length);
      const [item] = working.splice(index, 1);
      const uniqueKey = `${item.entry.id}:${item.meaningIndex}`;
      if (seenIds.has(uniqueKey)) {
        continue;
      }
      seenIds.add(uniqueKey);
      selection.push(buildCard(item));
    }

    if (selection.length === 0) {
      resetSessionState();
      setPhase('setup');
      return;
    }

    setQueue(selection);
    setBatchSize(selection.length);
    setUserInput('');
    setFeedback(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCorrectSet(new Set());
    setMistakes([]);
    setTip('');
    setTipStatus('idle');
    setAccentHint('');
    setPhase('active');
    setBatchId(prev => prev + 1);
    setStreak(0);
    setCelebrating(false);
  }, [practicePool, buildCard, resetSessionState]);

  const currentCard = queue[0] ?? null;

  useEffect(() => {
    if (phase !== 'summary' || tipStatus !== 'idle' || batchSize === 0) {
      return;
    }

    let cancelled = false;
    setTipStatus('loading');

    generateGeminiTip({ mistakes, direction, batchSize })
      .then(text => {
        if (!cancelled) {
          setTip(text);
          setTipStatus('success');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTipStatus('error');
          setTip('Great work! Keep building those connections by reviewing the words you just practiced.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [phase, tipStatus, mistakes, direction, batchSize, batchId]);

  const handleSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (!currentCard || phase !== 'active') {
        return;
      }

      const typed = userInput.trim();
      if (!typed) {
        setFeedback({ type: 'incorrect', message: 'Type an answer before checking.', answer: currentCard.displayAnswer });
        return;
      }

      const { isCorrect, bestAnswer, distance } = evaluateAnswer(typed, currentCard.answers, {
        requireAccents,
        strictSpelling,
      });

      if (isCorrect) {
        const existing = mastery[currentCard.entryId] ?? 0;
        const nextValue = Math.min(2, existing + 1);
        if (nextValue !== existing) {
          onUpdateMastery(currentCard.entryId, nextValue);
        }

        setCorrectCount(prev => prev + 1);
        const message = distance === 0 ? 'Great job! Keep going.' : 'Nice! Just tidy up the spelling next time.';
        setFeedback({ type: 'correct', message, answer: bestAnswer, distance });
        const newCorrect = new Set(correctSet);
        newCorrect.add(currentCard.id);
        setCorrectSet(newCorrect);
        setStreak(prev => prev + 1);
        setCelebrating(true);

        setQueue(prev => {
          if (prev.length === 0) return prev;
          const [, ...rest] = prev;
          return rest;
        });

        setUserInput('');
        setAccentHint('');

        if (newCorrect.size === batchSize) {
          setPhase('summary');
        }
      } else {
        setIncorrectCount(prev => prev + 1);
        setMistakes(prev => [
          ...prev,
          {
            prompt: currentCard.prompt,
            expected: currentCard.displayAnswer,
            userAnswer: typed,
          },
        ]);
        setFeedback({
          type: 'incorrect',
          message: retypeOnIncorrect
            ? 'Not quite. Type it again to lock it in!'
            : 'Not quite. Give it another try soon!',
          answer: currentCard.displayAnswer,
        });
        setStreak(0);

        if (!retypeOnIncorrect) {
          setQueue(prev => {
            if (prev.length === 0) return prev;
            const [first, ...rest] = prev;
            return [...rest, first];
          });
        }

        setUserInput('');
        setAccentHint('');
      }
    },
    [currentCard, phase, userInput, requireAccents, strictSpelling, mastery, onUpdateMastery, correctSet, batchSize, retypeOnIncorrect]
  );

  const handleInputChange = (value: string) => {
    setUserInput(value);
    const lastChar = value.slice(-1).toLowerCase();
    if ('aeiou'.includes(lastChar)) {
      setAccentHint('Tip: Press Tab to add an accent, Shift+Tab for ü-styled vowels.');
    } else if (lastChar === 'n') {
      setAccentHint('Tip: Press Tab to change n → ñ.');
    } else {
      setAccentHint('');
    }
  };

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Tab' && userInput) {
      const lastChar = userInput.slice(-1);
      const lower = lastChar.toLowerCase();
      let replacement = lastChar;
      if ('aeiou'.includes(lower)) {
        const accentMap: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
        const umlautMap: Record<string, string> = { a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü' };
        replacement = event.shiftKey ? umlautMap[lower] : accentMap[lower];
        if (lastChar === lastChar.toUpperCase()) {
          replacement = replacement.toUpperCase();
        }
      } else if (lower === 'n' && !event.shiftKey) {
        replacement = lastChar === lastChar.toUpperCase() ? 'Ñ' : 'ñ';
      }

      if (replacement !== lastChar) {
        event.preventDefault();
        setUserInput(prev => prev.slice(0, -1) + replacement);
        setAccentHint('');
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  const headerTitle = direction === 'ES_TO_EN' ? 'Spanish → English' : 'English → Spanish';

  const handleResetClick = () => {
    onResetMastery();
    resetSessionState();
    setPhase('setup');
  };

  const handleBackClick = () => {
    if (phase === 'active' && correctSet.size < batchSize) {
      const confirmLeave = window.confirm('Leave session? You will lose progress on this batch.');
      if (!confirmLeave) {
        return;
      }
    }
    onBack();
  };

  const sessionDisabled = wordSourceEntries.length === 0;
  const nextBatchLabel = practicePool.length <= 5 ? 'Run It Again' : 'Start Next Batch';

  return (
    <div className="min-h-screen flex flex-col w-full p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={handleBackClick} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <BackIcon className="w-6 h-6" />
          </button>
          <img src="https://via.placeholder.com/200" alt="Cuadernato Logo" className="w-10 h-10 rounded-md" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-display">Cuadernato</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Vocabulary Practice</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" /> Preferences
          </button>
          <button
            onClick={handleResetClick}
            className="bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Reset Mastery
          </button>
        </div>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto flex flex-col gap-6">
        {phase === 'setup' && (
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Kick off a new session</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose what you want to drill. Sessions run in batches of five prompts and earn tips tailored to what trips you up.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Direction</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDirection('ES_TO_EN')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        direction === 'ES_TO_EN'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      Spanish → English
                    </button>
                    <button
                      onClick={() => setDirection('EN_TO_ES')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        direction === 'EN_TO_ES'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      English → Spanish
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Word list</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setWordSource('ACTIVE')}
                      disabled={activeEntries.length === 0}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        wordSource === 'ACTIVE'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      } ${activeEntries.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      Activated list
                      <span className="block text-xs font-normal text-slate-400">
                        {activeEntries.length} entries ready
                      </span>
                    </button>
                    <button
                      onClick={() => setWordSource('STARRED')}
                      disabled={starredEntries.length === 0}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        wordSource === 'STARRED'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      } ${starredEntries.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      Starred words
                      <span className="block text-xs font-normal text-slate-400">
                        {starredEntries.length} saved picks
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex flex-col gap-2">
                {sessionDisabled ? (
                  <p className="text-sm text-rose-500 dark:text-rose-300">
                    Add starred words or activate a list to launch practice.
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You&apos;ll see up to five prompts per batch. Master a word twice to clear it.
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4" /> Session preferences
                  </button>
                  <button
                    onClick={initializeBatch}
                    disabled={sessionDisabled}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      sessionDisabled
                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Start session
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Mastery snapshot</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {Object.keys(mastery).length} / {dictionaryData.length} words tracked
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Reset anytime to restart from zero. Your mastery carries between sessions.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">Batches</p>
                  <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">5 cards at a time</p>
                </div>
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-500 dark:text-emerald-300">Tips</p>
                  <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">AI coaching after each set</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {phase === 'active' && (
          <>
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Batch progress</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {Math.min(correctSet.size, batchSize)} / {batchSize}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Words answered correctly at least once.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Correct</p>
                  <p className="text-2xl font-semibold text-emerald-500">{correctCount}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Incorrect</p>
                  <p className="text-2xl font-semibold text-rose-500">{incorrectCount}</p>
                </div>
              </div>
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/30 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">Streak</p>
                  <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-200">{streak}</p>
                </div>
                <p className="text-xs text-indigo-500 dark:text-indigo-300 mt-3">
                  Keep chaining correct answers to build momentum.
                </p>
              </div>
            </section>

            <section className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4 transition-shadow ${celebrating ? 'ring-4 ring-emerald-400/80 dark:ring-emerald-300/70 shadow-emerald-200/70' : ''}`}>
              {celebrating && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-300 text-lg font-semibold animate-bounce">
                    <CheckIcon className="w-6 h-6" /> Nailed it!
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Current prompt</p>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{currentCard?.prompt || 'Loading…'}</h2>
                  {currentCard && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span>Mastery</span>
                      <MasteryIndicator value={mastery[currentCard.entryId] ?? 0} />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Direction</p>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{headerTitle}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  value={userInput}
                  onChange={event => handleInputChange(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="w-full bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-400"
                  placeholder="Type your translation and press Enter"
                  disabled={!currentCard}
                  autoFocus
                />
                <div className="min-h-[44px] flex items-center">
                  <p className={`text-sm font-medium transition-opacity ${accentHint ? 'opacity-100 text-indigo-600 dark:text-indigo-300' : 'opacity-70 text-slate-400 dark:text-slate-500'}`}>
                    {accentHint || 'Use Tab for quick accents and ñ swaps while you type.'}
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    disabled={!currentCard}
                  >
                    Check answer
                  </button>
                </div>
              </form>

              {feedback && (
                <div
                  className={`border rounded-lg p-4 ${
                    feedback.type === 'correct'
                      ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200'
                      : 'border-rose-300 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-200'
                  }`}
                >
                  <p className="font-semibold">{feedback.message}</p>
                  <p className="text-sm mt-1">Answer: {feedback.answer}</p>
                  {typeof feedback.distance === 'number' && feedback.distance > 0 && feedback.type === 'correct' && (
                    <p className="text-xs mt-2 opacity-80">Within {feedback.distance} letter{feedback.distance === 1 ? '' : 's'} of perfect.</p>
                  )}
                </div>
              )}
            </section>
          </>
        )}

        {phase === 'summary' && (
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gemini Tip</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{headerTitle}</p>
            <div className="bg-slate-100 dark:bg-slate-900/60 rounded-lg p-4 min-h-[140px] flex items-center">
              {tipStatus === 'loading' && <span className="text-slate-500 dark:text-slate-400">Thinking…</span>}
              {tipStatus !== 'loading' && <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{tip}</p>}
            </div>
            {mistakes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Tricky spots</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {mistakes.map((mistake, index) => (
                    <li key={`${mistake.prompt}-${index}`} className="bg-slate-100 dark:bg-slate-900/60 rounded-md p-3">
                      <p><span className="font-medium">Prompt:</span> {mistake.prompt}</p>
                      <p><span className="font-medium">You said:</span> {mistake.userAnswer || '—'}</p>
                      <p><span className="font-medium">Answer:</span> {mistake.expected}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => {
                  resetSessionState();
                  setPhase('setup');
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Adjust session
              </button>
              <button
                onClick={initializeBatch}
                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={practicePool.length === 0}
              >
                {nextBatchLabel}
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="w-full max-w-5xl mx-auto text-center py-4 mt-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © 2024 Cuadernato. All Rights Reserved. A sample application for demonstration purposes.
        </p>
      </footer>

      <SettingsModal
        open={settingsOpen}
        strictSpelling={strictSpelling}
        requireAccents={requireAccents}
        retypeOnIncorrect={retypeOnIncorrect}
        onClose={() => setSettingsOpen(false)}
        onToggleStrictSpelling={() => setStrictSpelling(prev => !prev)}
        onToggleRequireAccents={() => setRequireAccents(prev => !prev)}
        onToggleRetypeOnIncorrect={() => setRetypeOnIncorrect(prev => !prev)}
      />
    </div>
  );
};

export default VocabPractice;
