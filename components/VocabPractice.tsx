import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DictionaryEntry } from '../types';
import { BackIcon, SettingsIcon } from './icons';
import { Modal } from './Modal';

type PracticeDirection = 'ES_TO_EN' | 'EN_TO_ES' | 'BOTH';

type WordSource = 'ACTIVE' | 'STARRED';

type PracticeCard = {
  id: string;
  entryId: string;
  meaningIndex: number;
  direction: Exclude<PracticeDirection, 'BOTH'>;
  promptLanguage: 'SPANISH' | 'ENGLISH';
  prompt: string;
  displayAnswer: string;
  answers: string[];
};

type FeedbackState = {
  type: 'correct' | 'incorrect';
  message: string;
  answer: string;
  distance?: number;
  cardId?: string;
};

type RecordedMistake = {
  cardId: string;
  prompt: string;
  expected: string;
  userAnswer: string;
};

type RecordedSuccess = {
  cardId: string;
  prompt: string;
  response: string;
  expected: string;
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

const ACCENT_MAP: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
const UMLAUT_MAP: Record<string, string> = { a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü' };
const INVERTED_PUNCTUATION: Record<string, string> = { '?': '¿', '!': '¡' };

type NatoMood = 'happy' | 'excited' | 'silly';

const NATO_DIALOGUE: Record<NatoMood, string[]> = {
  happy: [
    "You're doing great! Those words are sticking.",
    'Nice rhythm! Keep those translations flowing.',
    'Great focus—your recall is getting sharper every round.',
  ],
  excited: [
    'Boom! That batch was lightning fast!',
    'Outstanding! You are mastering these in record time.',
    'Yes! That was a clean sweep of tough vocabulary.',
  ],
  silly: [
    'Wiggle those fingers—let’s tackle the tricky ones together!',
    'Those words tried to trip you up, but we’ve got this!',
    'Keep smiling! Every stumble makes the next try easier.',
  ],
};

const NATO_IMAGE_MAP: Record<NatoMood, string> = {
  happy: '/images/nato-happy.png',
  excited: '/images/nato-excited.png',
  silly: '/images/nato-silly.png',
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
              Missed prompts slide to the end of the batch. Turn this on if you want a nudge to jump back in right away.
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
  const [batchId, setBatchId] = useState(0);
  const [accentHint, setAccentHint] = useState<React.ReactNode>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [incorrectHistory, setIncorrectHistory] = useState<RecordedMistake[]>([]);
  const [correctHistory, setCorrectHistory] = useState<RecordedSuccess[]>([]);
  const [carryoverCardIds, setCarryoverCardIds] = useState<string[]>([]);
  const [pendingOverride, setPendingOverride] = useState<{
    card: PracticeCard;
    bestAnswer: string;
    typedValue: string;
    previousStreak: number;
  } | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [lastBatchCards, setLastBatchCards] = useState<PracticeCard[]>([]);
  const [newlyMasteredInBatch, setNewlyMasteredInBatch] = useState(0);

  const masteryRef = useRef(mastery);
  const activeListSet = useMemo(() => new Set(activeList), [activeList]);

  const totalAttempts = correctCount + incorrectCount;
  const accuracy = totalAttempts === 0 ? 1 : correctCount / totalAttempts;
  const summaryMood: NatoMood = accuracy >= 0.95 ? 'excited' : accuracy >= 0.75 ? 'happy' : 'silly';
  const summaryMessage = useMemo(() => {
    const options = NATO_DIALOGUE[summaryMood];
    const safeIndex = ((batchId - 1) % options.length + options.length) % options.length;
    return options[safeIndex];
  }, [summaryMood, batchId]);
  const summaryImage = NATO_IMAGE_MAP[summaryMood];
  const accuracyPercent = Math.round(accuracy * 100);
  const summaryStats = useMemo(
    () => [
      { label: 'Accuracy', value: `${accuracyPercent}%` },
      { label: 'Batch size', value: String(batchSize) },
      { label: 'New words mastered', value: String(newlyMasteredInBatch) },
      { label: 'Longest streak', value: String(bestStreak) },
      { label: 'Still in rotation', value: String(carryoverCardIds.length) },
      { label: 'Correct tries', value: String(correctCount) },
    ],
    [accuracyPercent, batchSize, newlyMasteredInBatch, bestStreak, carryoverCardIds.length, correctCount]
  );
  const reviewItems = useMemo(() => {
    const seen = new Set<string>();
    const unique: RecordedMistake[] = [];
    incorrectHistory.forEach(item => {
      if (!seen.has(item.cardId)) {
        unique.push(item);
        seen.add(item.cardId);
      }
    });
    return unique;
  }, [incorrectHistory]);

  useEffect(() => {
    masteryRef.current = mastery;
  }, [mastery]);

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

  const createCard = useCallback(
    (entry: DictionaryEntry, meaningIndex: number, cardDirection: Exclude<PracticeDirection, 'BOTH'>): PracticeCard => {
      const meaning = entry.meanings[meaningIndex];
      const baseId = `${entry.id}:${meaningIndex}:${cardDirection}`;

      if (cardDirection === 'ES_TO_EN') {
        const spanishWord = meaning.spanish.word;
        const relatedMeanings = entry.meanings.filter(m => m.spanish.word === spanishWord);
        const englishAnswers = unique([
          meaning.english.word,
          ...relatedMeanings.flatMap(m => splitAnswers(m.english.word)),
        ]);

        return {
          id: baseId,
          entryId: entry.id,
          meaningIndex,
          direction: 'ES_TO_EN',
          promptLanguage: 'SPANISH',
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
        meaningIndex,
        direction: 'EN_TO_ES',
        promptLanguage: 'ENGLISH',
        prompt: englishWord,
        displayAnswer: meaning.spanish.word,
        answers: uniqueForms.length > 0 ? uniqueForms : [meaning.spanish.word],
      };
    },
    []
  );

  const practicePool = useMemo(() => {
    const cards: PracticeCard[] = [];

    wordSourceEntries.forEach(entry => {
      entry.meanings.forEach((_, meaningIndex) => {
        const directions: Exclude<PracticeDirection, 'BOTH'>[] =
          direction === 'BOTH' ? ['ES_TO_EN', 'EN_TO_ES'] : [direction];

        directions.forEach(cardDirection => {
          cards.push(createCard(entry, meaningIndex, cardDirection));
        });
      });
    });

    return cards.filter(card => (masteryRef.current[card.entryId] ?? 0) < 2);
  }, [wordSourceEntries, direction, createCard]);

  const resetSessionState = useCallback(() => {
    setQueue([]);
    setBatchSize(0);
    setUserInput('');
    setFeedback(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCorrectSet(new Set());
    setIncorrectHistory([]);
    setCorrectHistory([]);
    setAccentHint(null);
    setStreak(0);
    setBestStreak(0);
    setPendingOverride(null);
    setLastBatchCards([]);
    setNewlyMasteredInBatch(0);
    setCarryoverCardIds([]);
  }, []);

  const initializeBatch = useCallback(() => {
    if (practicePool.length === 0) {
      resetSessionState();
      setPhase('setup');
      return;
    }

    const selection: PracticeCard[] = [];
    const seenIds = new Set<string>();
    const usedCarryover = new Set<string>();

    const targetSize = Math.min(5, practicePool.length);

    carryoverCardIds.forEach(cardId => {
      if (selection.length >= targetSize) {
        return;
      }
      const card = practicePool.find(item => item.id === cardId);
      if (card && !seenIds.has(card.id)) {
        selection.push(card);
        seenIds.add(card.id);
        usedCarryover.add(card.id);
      }
    });

    const available = practicePool.filter(card => !seenIds.has(card.id));
    const working = [...available];

    while (selection.length < targetSize && working.length > 0) {
      const index = Math.floor(Math.random() * working.length);
      const [card] = working.splice(index, 1);
      selection.push(card);
      seenIds.add(card.id);
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
    setIncorrectHistory([]);
    setCorrectHistory([]);
    setAccentHint(null);
    setPhase('active');
    setBatchId(prev => prev + 1);
    setStreak(0);
    setBestStreak(0);
    setPendingOverride(null);
    setLastBatchCards(selection);
    setNewlyMasteredInBatch(0);
    setCarryoverCardIds(prev => prev.filter(id => !usedCarryover.has(id)));
  }, [practicePool, carryoverCardIds, resetSessionState]);

  const currentCard = queue[0] ?? null;

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

      setPendingOverride(null);

      if (isCorrect) {
        const existing = mastery[currentCard.entryId] ?? 0;
        const nextValue = Math.min(2, existing + 1);
        if (nextValue !== existing) {
          onUpdateMastery(currentCard.entryId, nextValue);
          if (nextValue === 2) {
            setNewlyMasteredInBatch(prev => prev + 1);
          }
        }

        setCorrectCount(prev => prev + 1);
        const message = distance === 0 ? 'Great job! Keep going.' : 'Nice! Just tidy up the spelling next time.';
        const updatedCorrect = new Set(correctSet);
        updatedCorrect.add(currentCard.id);
        setCorrectSet(updatedCorrect);
        setFeedback({ type: 'correct', message, answer: bestAnswer, distance, cardId: currentCard.id });
        setCorrectHistory(prev => [
          ...prev,
          {
            cardId: currentCard.id,
            prompt: currentCard.prompt,
            response: typed,
            expected: bestAnswer,
          },
        ]);
        setStreak(prev => {
          const next = prev + 1;
          setBestStreak(current => Math.max(current, next));
          return next;
        });

        setQueue(prev => {
          if (prev.length === 0) return prev;
          const [, ...rest] = prev;
          return rest;
        });

        setUserInput('');
        setAccentHint(null);

        if (updatedCorrect.size === batchSize) {
          setPhase('summary');
        }

        if (nextValue >= 2) {
          setCarryoverCardIds(prev => prev.filter(id => !id.startsWith(`${currentCard.entryId}:`)));
        }
      } else {
        setIncorrectCount(prev => prev + 1);
        setIncorrectHistory(prev => [
          ...prev,
          {
            cardId: currentCard.id,
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
          cardId: currentCard.id,
        });
        const previousStreak = streak;
        setPendingOverride({
          card: currentCard,
          bestAnswer,
          typedValue: typed,
          previousStreak,
        });
        setStreak(0);

        setQueue(prev => {
          if (prev.length === 0) return prev;
          const [first, ...rest] = prev;
          return [...rest, first];
        });

        setUserInput('');
        setAccentHint(null);
      }
    },
    [
      currentCard,
      phase,
      userInput,
      requireAccents,
      strictSpelling,
      mastery,
      onUpdateMastery,
      correctSet,
      batchSize,
      retypeOnIncorrect,
      streak,
    ]
  );

  const handleOverride = useCallback(() => {
    if (!pendingOverride) {
      return;
    }

    const { card, bestAnswer, typedValue, previousStreak } = pendingOverride;
    setPendingOverride(null);

    setIncorrectCount(prev => Math.max(0, prev - 1));
    setCorrectCount(prev => prev + 1);

    const updatedCorrect = new Set(correctSet);
    updatedCorrect.add(card.id);
    setCorrectSet(updatedCorrect);

    setFeedback({
      type: 'correct',
      message: 'Override applied. Marked correct!',
      answer: bestAnswer,
      cardId: card.id,
    });

    setIncorrectHistory(prev => {
      const copy = [...prev];
      for (let index = copy.length - 1; index >= 0; index -= 1) {
        const item = copy[index];
        if (item.cardId === card.id && item.userAnswer === typedValue) {
          copy.splice(index, 1);
          break;
        }
      }
      return copy;
    });

    setCorrectHistory(prev => [
      ...prev,
      {
        cardId: card.id,
        prompt: card.prompt,
        response: typedValue,
        expected: bestAnswer,
      },
    ]);

    const existing = masteryRef.current[card.entryId] ?? 0;
    const nextValue = Math.min(2, existing + 1);
    if (nextValue !== existing) {
      onUpdateMastery(card.entryId, nextValue);
      if (nextValue === 2) {
        setNewlyMasteredInBatch(prev => prev + 1);
      }
    }

    setStreak(previousStreak + 1);
    setBestStreak(current => Math.max(current, previousStreak + 1));

    setQueue(prev => prev.filter(item => item.id !== card.id));

    if (updatedCorrect.size === batchSize) {
      setPhase('summary');
    }

    setUserInput('');
    setAccentHint(null);

    if (nextValue >= 2) {
      setCarryoverCardIds(prev => prev.filter(id => !id.startsWith(`${card.entryId}:`)));
    }
  }, [pendingOverride, correctSet, batchSize, onUpdateMastery]);

  useEffect(() => {
    if (phase !== 'summary') {
      return;
    }

    setCarryoverCardIds(prev => {
      const next = new Set(prev);
      lastBatchCards.forEach(card => {
        const masteryValue = masteryRef.current[card.entryId] ?? 0;
        if (masteryValue < 2) {
          next.add(card.id);
        } else {
          Array.from(next).forEach(id => {
            if (id.startsWith(`${card.entryId}:`)) {
              next.delete(id);
            }
          });
        }
      });
      return Array.from(next);
    });
  }, [phase, lastBatchCards]);

  const handleInputChange = (value: string) => {
    setUserInput(value);
    const lastChar = value.slice(-1);
    if (!lastChar) {
      setAccentHint(null);
      return;
    }

    const lower = lastChar.toLowerCase();

    if (ACCENT_MAP[lower]) {
      const accentChar = lastChar === lastChar.toUpperCase() ? ACCENT_MAP[lower].toUpperCase() : ACCENT_MAP[lower];
      const umlautChar = lastChar === lastChar.toUpperCase() ? UMLAUT_MAP[lower].toUpperCase() : UMLAUT_MAP[lower];
      setAccentHint(
        <span>
          <strong>Press</strong> <kbd>Tab</kbd> for {accentChar}, or <kbd>Shift</kbd> + <kbd>Tab</kbd>{' '}
          <strong>for {umlautChar}.</strong>
        </span>
      );
      return;
    }

    if (lower === 'n') {
      const displayN = lastChar === lastChar.toUpperCase() ? 'N' : 'n';
      const displayEnye = lastChar === lastChar.toUpperCase() ? 'Ñ' : 'ñ';
      setAccentHint(
        <span>
          <strong>Press</strong> <kbd>Tab</kbd> to change {displayN} → {displayEnye}.
        </span>
      );
      return;
    }

    if (INVERTED_PUNCTUATION[lastChar]) {
      setAccentHint(
        <span>
          <strong>Press</strong> <kbd>Tab</kbd> <strong>for {INVERTED_PUNCTUATION[lastChar]}.</strong>
        </span>
      );
      return;
    }

    setAccentHint(null);
  };

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Tab' && userInput) {
      const lastChar = userInput.slice(-1);
      const lower = lastChar.toLowerCase();
      let replacement: string | null = null;

      if (ACCENT_MAP[lower]) {
        replacement = event.shiftKey ? UMLAUT_MAP[lower] : ACCENT_MAP[lower];
        if (lastChar === lastChar.toUpperCase()) {
          replacement = replacement.toUpperCase();
        }
      } else if (!event.shiftKey && lower === 'n') {
        replacement = lastChar === lastChar.toUpperCase() ? 'Ñ' : 'ñ';
      } else if (!event.shiftKey && INVERTED_PUNCTUATION[lastChar]) {
        replacement = INVERTED_PUNCTUATION[lastChar];
      }

      if (replacement) {
        event.preventDefault();
        setUserInput(prev => prev.slice(0, -1) + replacement);
        setAccentHint(null);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  const headerTitle = direction === 'ES_TO_EN'
    ? 'Spanish → English'
    : direction === 'EN_TO_ES'
      ? 'English → Spanish'
      : 'Spanish ↔ English';

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const confirmResetMastery = () => {
    onResetMastery();
    resetSessionState();
    setPhase('setup');
    setShowResetModal(false);
  };

  const handleBackClick = () => {
    const shouldWarn = phase === 'active'
      ? correctSet.size > 0 || incorrectCount > 0 || userInput.trim().length > 0
      : phase === 'summary';

    if (shouldWarn) {
      setShowLeaveModal(true);
      return;
    }

    resetSessionState();
    setPhase('setup');
    onBack();
  };

  const confirmLeaveSession = () => {
    setShowLeaveModal(false);
    resetSessionState();
    setPhase('setup');
    onBack();
  };

  const sessionDisabled = practicePool.length === 0;
  const nextBatchLabel = carryoverCardIds.length > 0
    ? 'Keep Reviewing'
    : practicePool.length <= 5
      ? 'Run It Again'
      : 'Start Next Batch';

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
                Choose what you want to drill. Sessions run in batches of five prompts, and anything you miss slides to the end
                so you can tackle it again.
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Direction</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                    <button
                      onClick={() => setDirection('BOTH')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        direction === 'BOTH'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      Both directions
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Word list</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/30 p-4 text-sm">
                  <p className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">Batches</p>
                  <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">5 cards at a time</p>
                  <p className="text-slate-500 dark:text-slate-300 mt-2">
                    Master each card twice to retire it. Missed prompts circle back at the end of the batch.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-emerald-500 dark:text-emerald-300">Momentum</p>
                    <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">Encouragement after every batch</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Session controls</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tune your preferences and launch when you&apos;re ready.
                  </p>
                </div>
                {sessionDisabled ? (
                  <p className="text-sm text-rose-500 dark:text-rose-300">
                    Add starred words or activate a list to launch practice.
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You&apos;ll step through fresh batches of five until everything is mastered.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
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
                <div className="relative group">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Correct</p>
                  <p className="text-2xl font-semibold text-emerald-500">{correctCount}</p>
                  <div
                    className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-56 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-900"
                    role="tooltip"
                  >
                    {correctHistory.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">No correct answers logged yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {correctHistory.slice(-6).map((item, index) => (
                          <li
                            key={`${item.cardId}-correct-${index}`}
                            className="border-b border-slate-100 pb-2 last:border-b-0 last:pb-0 dark:border-slate-700"
                          >
                            <p className="font-semibold text-slate-700 dark:text-slate-100">{item.prompt}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">You answered: {item.response || item.expected}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="relative group">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Incorrect</p>
                  <p className="text-2xl font-semibold text-rose-500">{incorrectCount}</p>
                  <div
                    className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-56 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-900"
                    role="tooltip"
                  >
                    {incorrectHistory.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">No misses—nice!</p>
                    ) : (
                      <ul className="space-y-2">
                        {incorrectHistory.slice(-6).map((item, index) => (
                          <li
                            key={`${item.cardId}-incorrect-${index}`}
                            className="border-b border-slate-100 pb-2 last:border-b-0 last:pb-0 dark:border-slate-700"
                          >
                            <p className="font-semibold text-slate-700 dark:text-slate-100">{item.prompt}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">You typed: {item.userAnswer || '—'}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Answer: {item.expected}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/30 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-amber-500 dark:text-amber-300">Streak</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-200">{streak}</p>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-300 mt-3">
                  Keep chaining correct answers to build momentum.
                </p>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Current prompt{currentCard ? ` (${currentCard.promptLanguage})` : ''}
                  </p>
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
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    {currentCard
                      ? currentCard.direction === 'ES_TO_EN'
                        ? 'Spanish → English'
                        : 'English → Spanish'
                      : headerTitle}
                  </p>
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
                  <p
                    className={`text-sm font-medium transition-opacity ${
                      accentHint
                        ? 'opacity-100 text-indigo-600 dark:text-indigo-300'
                        : 'opacity-70 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {accentHint || (
                      <span>
                        Need an accent? Type the letter and press <kbd>Tab</kbd>.
                      </span>
                    )}
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
                    <p className="text-xs mt-2 opacity-80">
                      Within {feedback.distance} letter{feedback.distance === 1 ? '' : 's'} of perfect.
                    </p>
                  )}
                  {feedback.type === 'incorrect' && pendingOverride && pendingOverride.card.id === feedback.cardId && (
                    <button
                      type="button"
                      onClick={handleOverride}
                      className="mt-3 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
                    >
                      Override: I was correct
                    </button>
                  )}
                </div>
              )}
            </section>
          </>
        )}

        {phase === 'summary' && (
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="grid gap-6 lg:grid-cols-[auto,1fr]">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={summaryImage}
                  alt="Nato celebrating your progress"
                  className="h-32 w-32 rounded-full object-contain sm:h-40 sm:w-40"
                />
                <div className="relative max-w-xs rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 p-4 text-slate-700 dark:text-slate-200 shadow-inner">
                  <p className="text-sm leading-relaxed">{summaryMessage}</p>
                  <span className="absolute -left-3 top-8 h-6 w-6 rotate-45 rounded-sm bg-indigo-50 dark:bg-indigo-900/40"></span>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Batch summary</p>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">You&apos;re doing great!</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    You cleared {Math.min(correctSet.size, batchSize)} of {batchSize} prompts this round.
                    {carryoverCardIds.length > 0
                      ? ` We'll revisit ${carryoverCardIds.length} more${carryoverCardIds.length === 1 ? '' : ' words'} next batch.`
                      : ' Everything from this batch is locked in!'}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {summaryStats.map(stat => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4"
                    >
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</p>
                      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
                {reviewItems.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Words to keep an eye on</h3>
                    <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                      {reviewItems.map((mistake, index) => (
                        <li
                          key={`${mistake.cardId}-review-${index}`}
                          className="rounded-lg bg-slate-100 dark:bg-slate-900/60 p-3"
                        >
                          <p className="font-medium text-slate-700 dark:text-slate-100">Prompt: {mistake.prompt}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">You typed: {mistake.userAnswer || '—'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Answer: {mistake.expected}</p>
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
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="w-full max-w-5xl mx-auto text-center py-4 mt-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © 2024 Cuadernato. All Rights Reserved. A sample application for demonstration purposes.
        </p>
      </footer>

      {showResetModal && (
        <Modal title="Reset mastery?" onClose={() => setShowResetModal(false)} variant="gray">
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This will clear mastery progress for every word you&apos;ve tracked. You&apos;ll restart from zero next time you
              practice.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmResetMastery}
                className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
              >
                Reset mastery
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showLeaveModal && (
        <Modal title="Leave session?" onClose={() => setShowLeaveModal(false)} variant="gray">
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Leaving now will discard your progress on this batch. You can always jump back in later.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Stay here
              </button>
              <button
                onClick={confirmLeaveSession}
                className="px-3 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors"
              >
                Leave session
              </button>
            </div>
          </div>
        </Modal>
      )}

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
