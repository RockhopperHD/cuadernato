import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DictionaryEntry } from '../types';
import { BackIcon } from './icons';
import { Modal } from './Modal';

type PracticeDirection = 'ES_TO_EN' | 'EN_TO_ES' | 'BOTH';
type MasteryResetScope = 'ALL' | 'STARRED' | 'ACTIVE_LIST';

type WordSource = 'ACTIVE' | 'STARRED' | 'ALL';

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

interface VocabPracticeProps {
  dictionaryData: DictionaryEntry[];
  mastery: Record<string, number>;
  onUpdateMastery: (entryId: string, newValue: number) => void;
  onResetMastery: (scope: MasteryResetScope) => void;
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
  const [wordSource, setWordSource] = useState<WordSource>(() => {
    const hasActiveEntries = dictionaryData.some(entry => activeList.includes(entry.id));
    if (hasActiveEntries) {
      return 'ACTIVE';
    }
    const hasStarredEntries = dictionaryData.some(entry => entry.starred);
    if (hasStarredEntries) {
      return 'STARRED';
    }
    return 'ALL';
  });
  const [strictSpelling, setStrictSpelling] = useState(false);
  const [requireAccents, setRequireAccents] = useState(false);
  const [retypeOnIncorrect, setRetypeOnIncorrect] = useState(true);
  const [preferredBatchSize, setPreferredBatchSize] = useState(5);

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
  const [resetStage, setResetStage] = useState<{ view: 'options' } | { view: 'confirm'; scope: MasteryResetScope } | { view: 'confirm-all'; input: string } | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [lastBatchCards, setLastBatchCards] = useState<PracticeCard[]>([]);
  const [newlyMasteredInBatch, setNewlyMasteredInBatch] = useState(0);
  const [settingWarning, setSettingWarning] = useState<{ apply: () => void; description: string } | null>(null);
  const [restartAfterSettings, setRestartAfterSettings] = useState(false);
  const [answerFlash, setAnswerFlash] = useState<'correct' | null>(null);
  const [streakHighlight, setStreakHighlight] = useState(false);
  const [compactDirectionLabels, setCompactDirectionLabels] = useState(false);

  const masteryRef = useRef(mastery);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousStreakRef = useRef(0);
  const activeListSet = useMemo(() => new Set(activeList), [activeList]);
  const starredEntries = useMemo(
    () => dictionaryData.filter(entry => entry.starred),
    [dictionaryData]
  );

  const activeEntries = useMemo(
    () => dictionaryData.filter(entry => activeListSet.has(entry.id)),
    [dictionaryData, activeListSet]
  );

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
  const masteryBreakdown = useMemo(() => {
    const totalTracked = Object.keys(mastery).length;
    const starredIds = new Set(starredEntries.map(entry => entry.id));
    let starredTracked = 0;
    let activeTracked = 0;
    Object.keys(mastery).forEach(id => {
      if (starredIds.has(id)) {
        starredTracked += 1;
      }
      if (activeListSet.has(id)) {
        activeTracked += 1;
      }
    });

    const percent = (count: number, total: number) => (total === 0 ? 0 : Math.round((count / total) * 100));

    return {
      totalTracked,
      totalPercent: percent(totalTracked, dictionaryData.length),
      starredTracked,
      starredPercent: percent(starredTracked, starredEntries.length),
      activeTracked,
      activePercent: percent(activeTracked, activeEntries.length),
      starredTotal: starredEntries.length,
      activeTotal: activeEntries.length,
      dictionaryTotal: dictionaryData.length,
    };
  }, [mastery, dictionaryData.length, starredEntries, activeEntries, activeListSet]);
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

  const requestSettingUpdate = useCallback(
    (description: string, change: () => void) => {
      const perform = () => {
        change();
        setRestartAfterSettings(true);
      };

      if (phase === 'setup') {
        change();
        return;
      }

      if (phase === 'active') {
        if (streak > 0) {
          setSettingWarning({ description, apply: perform });
          return;
        }
        perform();
        return;
      }

      perform();
    },
    [phase, streak]
  );
  const confirmSettingWarning = () => {
    if (!settingWarning) {
      return;
    }
    settingWarning.apply();
    setSettingWarning(null);
  };
  const cancelSettingWarning = () => setSettingWarning(null);
  const updateClearConfirmation = (value: string) => {
    setResetStage(prev => (prev && prev.view === 'confirm-all' ? { view: 'confirm-all', input: value.toUpperCase() } : prev));
  };

  useEffect(() => {
    masteryRef.current = mastery;
  }, [mastery]);

  useEffect(() => {
    const update = () => {
      setCompactDirectionLabels(window.innerWidth < 640);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!answerFlash) return;
    const timeout = window.setTimeout(() => setAnswerFlash(null), 400);
    return () => window.clearTimeout(timeout);
  }, [answerFlash]);

  useEffect(() => {
    if (!streakHighlight) return;
    const timeout = window.setTimeout(() => setStreakHighlight(false), 450);
    return () => window.clearTimeout(timeout);
  }, [streakHighlight]);

  useEffect(() => {
    if (streak > previousStreakRef.current || (streak === 0 && previousStreakRef.current > 0)) {
      setStreakHighlight(true);
    }
    previousStreakRef.current = streak;
  }, [streak]);

  useEffect(() => {
    if (dictionaryData.length === 0) {
      return;
    }

    if (wordSource === 'ACTIVE' && activeEntries.length === 0) {
      if (starredEntries.length > 0) {
        setWordSource('STARRED');
      } else {
        setWordSource('ALL');
      }
    } else if (wordSource === 'STARRED' && starredEntries.length === 0) {
      if (activeEntries.length > 0) {
        setWordSource('ACTIVE');
      } else {
        setWordSource('ALL');
      }
    } else if (wordSource !== 'ALL' && activeEntries.length === 0 && starredEntries.length === 0) {
      setWordSource('ALL');
    }
  }, [
    wordSource,
    activeEntries.length,
    starredEntries.length,
    dictionaryData.length,
  ]);

  const wordSourceEntries = useMemo(() => {
    if (wordSource === 'ACTIVE') {
      return activeEntries;
    }
    if (wordSource === 'STARRED') {
      return starredEntries;
    }
    return dictionaryData;
  }, [wordSource, activeEntries, starredEntries, dictionaryData]);

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

    const targetSize = Math.min(preferredBatchSize, practicePool.length);

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
  }, [practicePool, carryoverCardIds, resetSessionState, preferredBatchSize]);

  useEffect(() => {
    if (!restartAfterSettings) {
      return;
    }

    if (phase === 'active') {
      resetSessionState();
      initializeBatch();
    } else if (phase === 'summary') {
      resetSessionState();
      setPhase('setup');
    }

    setRestartAfterSettings(false);
  }, [restartAfterSettings, phase, resetSessionState, initializeBatch]);

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
        setAnswerFlash('correct');

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
        if (!retypeOnIncorrect) {
          setStreak(0);
        }

        setQueue(prev => {
          if (prev.length === 0) return prev;
          const [first, ...rest] = prev;
          return retypeOnIncorrect ? [first, ...rest] : [...rest, first];
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
    setAnswerFlash('correct');

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
    const listener = (event: KeyboardEvent) => {
      if (event.key !== '-' || !pendingOverride || phase !== 'active') {
        return;
      }
      if (document.activeElement === inputRef.current) {
        return;
      }
      event.preventDefault();
      handleOverride();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [pendingOverride, phase, handleOverride]);

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
          Press <kbd>Tab</kbd> for {accentChar}, or <kbd>Shift</kbd> + <kbd>Tab</kbd> for {umlautChar}.
        </span>
      );
      return;
    }

    if (lower === 'n') {
      const displayN = lastChar === lastChar.toUpperCase() ? 'N' : 'n';
      const displayEnye = lastChar === lastChar.toUpperCase() ? 'Ñ' : 'ñ';
      setAccentHint(
        <span>
          Press <kbd>Tab</kbd> to change {displayN} → {displayEnye}.
        </span>
      );
      return;
    }

    if (INVERTED_PUNCTUATION[lastChar]) {
      setAccentHint(
        <span>
          Press <kbd>Tab</kbd> for {INVERTED_PUNCTUATION[lastChar]}.
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
  const directionLabelMap: Record<PracticeDirection, string> = compactDirectionLabels
    ? {
        ES_TO_EN: 'ES → EN',
        BOTH: 'Both',
        EN_TO_ES: 'EN → ES',
      }
    : {
        ES_TO_EN: 'Spanish → English',
        BOTH: 'Both directions',
        EN_TO_ES: 'English → Spanish',
      };
  const directionOptions: PracticeDirection[] = ['ES_TO_EN', 'BOTH', 'EN_TO_ES'];
  const clampBatchSize = (value: number) => Math.min(15, Math.max(3, Math.round(value)));
  const handleBatchSizeChange = (value: number) => {
    if (Number.isNaN(value)) {
      return;
    }
    const clamped = clampBatchSize(value);
    if (clamped === preferredBatchSize) {
      return;
    }
    requestSettingUpdate('batch size', () => setPreferredBatchSize(clamped));
  };
  const streakIsActive = streak > 0;
  const streakCardClassName = `rounded-xl p-4 flex flex-col justify-between transition-all duration-200 ${
    streakIsActive
      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-200'
      : 'bg-slate-100 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400'
  } ${streakHighlight ? 'ring-2 ring-amber-400/60 shadow-lg' : ''}`;
  const renderPreferenceToggleList = () => (
    <div className="space-y-3 text-sm">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={strictSpelling}
          onChange={() => requestSettingUpdate('strict spelling', () => setStrictSpelling(prev => !prev))}
          className="mt-1"
        />
        <span className="text-slate-600 dark:text-slate-300">
          <span className="block font-semibold text-slate-800 dark:text-slate-100">Strict spelling</span>
          Allow a two-letter cushion when off, or demand perfect matches when on.
        </span>
      </label>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={requireAccents}
          onChange={() => requestSettingUpdate('accent requirement', () => setRequireAccents(prev => !prev))}
          className="mt-1"
        />
        <span className="text-slate-600 dark:text-slate-300">
          <span className="block font-semibold text-slate-800 dark:text-slate-100">Require accents</span>
          When enabled, á/é/í/ó/ú must be typed exactly to earn credit.
        </span>
      </label>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={retypeOnIncorrect}
          onChange={() => requestSettingUpdate('type it again setting', () => setRetypeOnIncorrect(prev => !prev))}
          className="mt-1"
        />
        <span className="text-slate-600 dark:text-slate-300">
          <span className="block font-semibold text-slate-800 dark:text-slate-100">Type it again</span>
          Stay on the prompt until you nail it. Turn off to cycle it to the end instead.
        </span>
      </label>
    </div>
  );

  const handleResetClick = () => {
    setResetStage({ view: 'options' });
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetStage(null);
  };

  const finalizeReset = (scope: MasteryResetScope) => {
    onResetMastery(scope);
    resetSessionState();
    setPhase('setup');
    closeResetModal();
  };
  const proceedResetScope = (scope: MasteryResetScope) => {
    if (scope === 'ALL') {
      setResetStage({ view: 'confirm-all', input: '' });
      return;
    }
    finalizeReset(scope);
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
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Kick off a new session</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Choose what you want to drill. Sessions run in batches, and anything you miss slides to the end so you can tackle it again.
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Direction</p>
                    <div className="flex gap-2 overflow-x-auto sm:overflow-visible pb-1">
                      {directionOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => setDirection(option)}
                          className={`shrink-0 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                            direction === option
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {directionLabelMap[option]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Word list</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                      <button
                        onClick={() => setWordSource('ALL')}
                        disabled={dictionaryData.length === 0}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                          wordSource === 'ALL'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                        } ${dictionaryData.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        Whole dictionary
                        <span className="block text-xs font-normal text-slate-400">
                          {dictionaryData.length} total entries
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Mastery snapshot</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Reset anytime to restart from zero. Your mastery carries between sessions.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-900/30 p-4 text-slate-700 dark:text-slate-100">
                    <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Total tracked</p>
                    <p className="text-2xl font-bold mt-1">{masteryBreakdown.totalTracked} / {masteryBreakdown.dictionaryTotal}</p>
                    <p className="text-xs mt-1 text-indigo-700/80 dark:text-indigo-200/80">{masteryBreakdown.totalPercent}% of library</p>
                  </div>
                  <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-900/30 p-4 text-slate-700 dark:text-slate-100">
                    <p className="text-xs uppercase tracking-wide text-rose-600 dark:text-rose-300">Starred words</p>
                    <p className="text-2xl font-bold mt-1">{masteryBreakdown.starredTracked} / {masteryBreakdown.starredTotal}</p>
                    <p className="text-xs mt-1 text-rose-700/80 dark:text-rose-200/80">{masteryBreakdown.starredPercent}% mastered</p>
                  </div>
                  <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-900/30 p-4 text-slate-700 dark:text-slate-100">
                    <p className="text-xs uppercase tracking-wide text-sky-600 dark:text-sky-300">Active list</p>
                    <p className="text-2xl font-bold mt-1">{masteryBreakdown.activeTracked} / {masteryBreakdown.activeTotal}</p>
                    <p className="text-xs mt-1 text-sky-700/80 dark:text-sky-200/80">{masteryBreakdown.activePercent}% cleared</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Batches</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Master each card twice to retire it.</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">{preferredBatchSize} cards</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={3}
                    max={15}
                    value={preferredBatchSize}
                    onChange={event => handleBatchSizeChange(Number(event.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={preferredBatchSize}
                    onChange={event => handleBatchSizeChange(Number(event.target.value))}
                    className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm dark:border-slate-600 dark:bg-slate-900"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Missed prompts jump to the end of the batch so you can lock them in before moving on.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Session preferences</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Adjustments mid-run restart your batch. You&apos;ll be asked before losing an active streak.
                  </p>
                </div>
                {renderPreferenceToggleList()}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {sessionDisabled ? (
                    <p className="text-sm text-rose-500 dark:text-rose-300">Add starred words or activate a list to launch practice.</p>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">You&apos;ll refresh batches until everything is mastered.</p>
                  )}
                  <button
                    onClick={initializeBatch}
                    disabled={sessionDisabled}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
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
              <div className={streakCardClassName}>
                <div>
                  <p className={`text-xs uppercase tracking-wide ${streakIsActive ? 'text-amber-500 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    Streak
                  </p>
                  <p className={`text-3xl font-bold ${streakIsActive ? 'text-amber-600 dark:text-amber-200' : 'text-slate-600 dark:text-slate-300'}`}>
                    {streak}
                  </p>
                </div>
                <p className={`text-xs mt-3 ${streakIsActive ? 'text-amber-600 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  Keep chaining correct answers to build momentum.
                </p>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    CURRENT PROMPT{currentCard ? ` (${currentCard.promptLanguage})` : ''}
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
                  ref={inputRef}
                  className="w-full bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 transition-shadow"
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
                        Press <kbd>Tab</kbd> to accent the last letter. <kbd>Shift</kbd> + <kbd>Tab</kbd> gives the umlaut.
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800"
                    disabled={!currentCard}
                  >
                    Check answer
                  </button>
                </div>
              </form>

              {feedback && (
                <div
                  className={`rounded-lg p-4 transition-all duration-200 ${
                    feedback.type === 'correct'
                      ? 'border border-emerald-300 bg-emerald-100/80 text-emerald-800 shadow-md dark:bg-emerald-900/30 dark:text-emerald-200'
                      : 'border border-rose-300 bg-rose-100/70 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200'
                  } ${feedback.type === 'correct' && answerFlash ? 'ring-2 ring-emerald-400/60 shadow-lg scale-[1.01]' : ''}`}
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
                      Override: I was correct <span className="font-normal text-xs opacity-70">(press -)</span>
                    </button>
                  )}
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Session settings</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Updates take effect immediately and restart the current batch.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Batch size</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={3}
                      max={15}
                      value={preferredBatchSize}
                      onChange={event => handleBatchSizeChange(Number(event.target.value))}
                      className="accent-indigo-600"
                    />
                    <span className="w-10 text-sm font-semibold text-indigo-600 dark:text-indigo-300 text-right">
                      {preferredBatchSize}
                    </span>
                  </div>
                </div>
              </div>
              {renderPreferenceToggleList()}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                If you have a streak running, we&apos;ll double-check before wiping it out.
              </p>
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
                    <ul className="grid max-h-60 overflow-y-auto gap-2 pr-1 text-sm text-slate-600 dark:text-slate-300">
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

      {showResetModal && resetStage && (
        <Modal title="Reset mastery" onClose={closeResetModal} variant="gray">
          {resetStage.view === 'options' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Choose how much progress to clear. This action cannot be undone.
              </p>
              <div className="grid gap-3 text-left text-sm">
                <button
                  className="rounded-xl border border-sky-200 bg-sky-50/80 p-4 text-slate-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-900/30 dark:text-slate-100"
                  onClick={() => setResetStage({ view: 'confirm', scope: 'ACTIVE_LIST' })}
                >
                  <span className="block text-base font-semibold text-sky-700 dark:text-sky-200">Active list</span>
                  <span className="block text-xs mt-1 text-slate-500 dark:text-slate-400">Only reset mastery for words in this session&apos;s active list.</span>
                </button>
                <button
                  className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-slate-700 transition hover:border-rose-300 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/30 dark:text-slate-100"
                  onClick={() => setResetStage({ view: 'confirm', scope: 'STARRED' })}
                >
                  <span className="block text-base font-semibold text-rose-700 dark:text-rose-200">Starred words</span>
                  <span className="block text-xs mt-1 text-slate-500 dark:text-slate-400">Clear mastery for every word you&apos;ve starred.</span>
                </button>
                <button
                  className="rounded-xl border border-slate-300 bg-slate-100 p-4 text-slate-700 transition hover:border-slate-400 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  onClick={() => setResetStage({ view: 'confirm', scope: 'ALL' })}
                >
                  <span className="block text-base font-semibold text-slate-800 dark:text-slate-100">Everything</span>
                  <span className="block text-xs mt-1 text-slate-500 dark:text-slate-400">Wipe out mastery for every tracked word.</span>
                </button>
              </div>
            </div>
          )}
          {resetStage.view === 'confirm' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {resetStage.scope === 'ACTIVE_LIST'
                  ? "You're clearing all mastery on your active list. Are you sure?"
                  : resetStage.scope === 'STARRED'
                    ? "You're clearing all mastery on your starred words. Are you sure?"
                    : 'This will delete all of your mastery on EVERYTHING! Be seriously sure you want to do this.'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setResetStage({ view: 'options' })}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Go back
                </button>
                <button
                  onClick={() => proceedResetScope(resetStage.scope)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    resetStage.scope === 'ALL'
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {resetStage.scope === 'ALL' ? 'Continue' : 'Yes, reset it'}
                </button>
              </div>
            </div>
          )}
          {resetStage.view === 'confirm-all' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                This will delete all of your mastery on EVERYTHING! Be seriously sure you want to do this.
              </p>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Type <span className="font-semibold text-slate-800 dark:text-slate-100">CLEAR</span> to confirm.
                <input
                  value={resetStage.input}
                  onChange={event => updateClearConfirmation(event.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 uppercase tracking-widest text-center text-sm font-semibold dark:border-slate-600 dark:bg-slate-900"
                />
              </label>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setResetStage({ view: 'options' })}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => finalizeReset('ALL')}
                  disabled={resetStage.input !== 'CLEAR'}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    resetStage.input === 'CLEAR'
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-rose-300 text-white opacity-70'
                  }`}
                >
                  Delete mastery
                </button>
              </div>
            </div>
          )}
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
      {settingWarning && (
        <Modal title="Restart batch?" onClose={cancelSettingWarning} variant="blue">
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Changing your {settingWarning.description} resets this batch and clears your streak.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelSettingWarning}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSettingWarning}
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Restart &amp; apply
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VocabPractice;
