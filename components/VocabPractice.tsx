import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DictionaryEntry } from '../types';
import { BackIcon } from './icons';
import { generateGeminiTip, GeminiMistake, GeminiDirection } from '../utils/gemini';

type PracticeDirection = GeminiDirection;

type PracticeCard = {
  id: string;
  entryId: string;
  prompt: string;
  displayAnswer: string;
  answers: string[];
};

const removeAccents = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normalize = (value: string, strict: boolean): string => {
  const trimmed = value.trim().toLowerCase();
  return strict ? trimmed : removeAccents(trimmed);
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
  const [strictMode, setStrictMode] = useState(false);
  const [queue, setQueue] = useState<PracticeCard[]>([]);
  const [batchSize, setBatchSize] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string; answer: string } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [correctSet, setCorrectSet] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState<GeminiMistake[]>([]);
  const [batchCompleted, setBatchCompleted] = useState(false);
  const [tipStatus, setTipStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tip, setTip] = useState('');
  const [batchId, setBatchId] = useState(0);
  const [noWordsAvailable, setNoWordsAvailable] = useState(false);
  const [accentHint, setAccentHint] = useState('');

  const currentCard = queue[0] ?? null;
  const masteryRef = useRef(mastery);

  useEffect(() => {
    masteryRef.current = mastery;
  }, [mastery]);

  const practicePool = useMemo(() => {
    const listFilter = new Set(activeList);
    const entries = activeList.length > 0
      ? dictionaryData.filter(entry => listFilter.has(entry.id))
      : dictionaryData;

    return entries.flatMap(entry =>
      entry.meanings.map((meaning, index) => ({ entry, meaning, meaningIndex: index }))
    );
  }, [dictionaryData, activeList]);

  const buildCard = useCallback(
    (item: { entry: DictionaryEntry; meaningIndex: number }): PracticeCard => {
      const { entry, meaningIndex } = item;
      const meaning = entry.meanings[meaningIndex];
      const baseId = `${entry.id}:${meaningIndex}`;

      if (direction === 'ES_TO_EN') {
        const spanishWord = meaning.spanish.word;
        const englishAnswers = splitAnswers(meaning.english.word);
        return {
          id: baseId,
          entryId: entry.id,
          prompt: spanishWord,
          displayAnswer: meaning.english.word,
          answers: englishAnswers.length > 0 ? englishAnswers : [meaning.english.word],
        };
      }

      const englishWord = meaning.english.word;
      const spanishForms = [meaning.spanish.word];
      if (meaning.spanish.gender_map) {
        Object.keys(meaning.spanish.gender_map).forEach(term => {
          const cleanTerm = term.split('/')[0].trim();
          if (cleanTerm) {
            spanishForms.push(cleanTerm);
          }
        });
      }
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

  const initializeBatch = useCallback(() => {
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
      setQueue([]);
      setBatchSize(0);
      setNoWordsAvailable(true);
      setBatchCompleted(false);
      setTip('');
      setTipStatus('idle');
      setCorrectCount(0);
      setIncorrectCount(0);
      setCorrectSet(new Set());
      setMistakes([]);
      setFeedback(null);
      setAccentHint('');
      return;
    }

    setQueue(selection);
    setBatchSize(selection.length);
    setNoWordsAvailable(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCorrectSet(new Set());
    setMistakes([]);
    setFeedback(null);
    setBatchCompleted(false);
    setTip('');
    setTipStatus('idle');
    setUserInput('');
    setAccentHint('');
    setBatchId(prev => prev + 1);
  }, [practicePool, buildCard]);

  useEffect(() => {
    initializeBatch();
  }, [initializeBatch]);

  useEffect(() => {
    if (!batchCompleted || tipStatus !== 'idle' || batchSize === 0) {
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
  }, [batchCompleted, tipStatus, mistakes, direction, batchSize, batchId]);

  const handleSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (!currentCard || batchCompleted) {
        return;
      }

      const typed = userInput.trim();
      if (!typed) {
        setFeedback({ type: 'incorrect', message: 'Type an answer before checking.', answer: currentCard.displayAnswer });
        return;
      }

      const inputNormalized = normalize(typed, strictMode);
      const isCorrect = currentCard.answers.some(answer => normalize(answer, strictMode) === inputNormalized);

      if (isCorrect) {
        const existing = mastery[currentCard.entryId] ?? 0;
        const nextValue = Math.min(2, existing + 1);
        if (nextValue !== existing) {
          onUpdateMastery(currentCard.entryId, nextValue);
        }

        setCorrectCount(prev => prev + 1);
        setFeedback({ type: 'correct', message: 'Great job! Keep going.', answer: currentCard.displayAnswer });
        const newCorrect = new Set(correctSet);
        newCorrect.add(currentCard.id);
        setCorrectSet(newCorrect);

        setQueue(prev => {
          if (prev.length === 0) return prev;
          const [, ...rest] = prev;
          return rest;
        });

        if (newCorrect.size === batchSize) {
          setBatchCompleted(true);
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
        setFeedback({ type: 'incorrect', message: 'Not quite. Give it another try!', answer: currentCard.displayAnswer });
        setQueue(prev => {
          if (prev.length === 0) return prev;
          const [first, ...rest] = prev;
          return [...rest, first];
        });
      }

      setUserInput('');
      setAccentHint('');
    },
    [batchCompleted, currentCard, strictMode, mastery, onUpdateMastery, correctSet, batchSize, userInput]
  );

  const handleInputChange = (value: string) => {
    setUserInput(value);
    const lastChar = value.slice(-1).toLowerCase();
    if ('aeiou'.includes(lastChar)) {
      setAccentHint('Press Tab to add an accent or Shift+Tab for an umlaut.');
    } else if (lastChar === 'n') {
      setAccentHint('Press Tab to change n → ñ.');
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
    initializeBatch();
  };

  return (
    <div className="min-h-screen flex flex-col w-full p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <BackIcon className="w-6 h-6" />
          </button>
          <img src="https://via.placeholder.com/200" alt="Cuadernato Logo" className="w-10 h-10 rounded-md" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-display">Cuadernato</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Vocabulary Practice</p>
          </div>
        </div>
        <button
          onClick={handleResetClick}
          className="bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors"
        >
          Reset Mastery
        </button>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col gap-6">
        <section className="grid gap-4 md:grid-cols-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Mode</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setDirection('ES_TO_EN')}
                className={`flex-1 py-2 rounded-lg border ${direction === 'ES_TO_EN' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'}`}
              >
                Spanish → English
              </button>
              <button
                onClick={() => setDirection('EN_TO_ES')}
                className={`flex-1 py-2 rounded-lg border ${direction === 'EN_TO_ES' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'}`}
              >
                English → Spanish
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All learners practice Spanish terms. Switch directions to challenge yourself with translations.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Preferences</h2>
            <label className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-300">Strict spelling (accents required)</span>
              <input
                type="checkbox"
                checked={strictMode}
                onChange={() => setStrictMode(prev => !prev)}
                className="h-5 w-5"
              />
            </label>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {strictMode
                ? 'Answers must exactly match the target spelling.'
                : 'Accents are optional—perfect for quick drills.'}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Batch progress</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {Math.min(correctSet.size, batchSize)} / {batchSize}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Words answered correctly at least once.</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Correct</p>
              <p className="text-2xl font-semibold text-emerald-500">{correctCount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Incorrect</p>
              <p className="text-2xl font-semibold text-rose-500">{incorrectCount}</p>
            </div>
          </div>
        </section>

        {noWordsAvailable ? (
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center gap-4">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Everything is mastered!</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Reset mastery to cycle words again or activate a different list to keep practicing.
            </p>
          </section>
        ) : batchCompleted ? (
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gemini Tip</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{headerTitle}</p>
            <div className="bg-slate-100 dark:bg-slate-900/60 rounded-lg p-4 min-h-[120px] flex items-center">
              {tipStatus === 'loading' && <span className="text-slate-500 dark:text-slate-400">Thinking…</span>}
              {tipStatus !== 'loading' && <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{tip}</p>}
            </div>
            {mistakes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Tricky spots</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {mistakes.map((mistake, index) => (
                    <li key={`${mistake.prompt}-${index}`} className="bg-slate-100 dark:bg-slate-900/60 rounded-md p-2">
                      <p><span className="font-medium">Prompt:</span> {mistake.prompt}</p>
                      <p><span className="font-medium">You said:</span> {mistake.userAnswer || '—'}</p>
                      <p><span className="font-medium">Answer:</span> {mistake.expected}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={initializeBatch}
                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Next Batch
              </button>
            </div>
          </section>
        ) : (
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col gap-4">
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                value={userInput}
                onChange={event => handleInputChange(event.target.value)}
                onKeyDown={handleInputKeyDown}
                className="w-full bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-400"
                placeholder="Type your translation and press Enter"
                disabled={!currentCard}
                autoFocus
              />
              {accentHint && <p className="text-xs text-indigo-600 dark:text-indigo-300">{accentHint}</p>}
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
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="w-full max-w-4xl mx-auto text-center py-4 mt-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © 2024 Cuadernato. All Rights Reserved. A sample application for demonstration purposes.
        </p>
      </footer>
    </div>
  );
};

export default VocabPractice;
