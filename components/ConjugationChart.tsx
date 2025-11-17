
import React, { useMemo, useState } from 'react';
import { PartOfSpeech, SpanishSide, Tense, Mood, MeaningTags, PronounConjugation } from '../types';
import { generateConjugations, getIrregularOverrides, IrregularOverride } from '../utils/conjugation';

interface ConjugationChartProps {
  spanish: SpanishSide;
  pos: PartOfSpeech;
  tags?: MeaningTags;
}

const TENSES: Tense[] = ['present', 'preterite', 'imperfect'];
const MOODS: Mood[] = ['indicative', 'subjunctive'];

const CORE_CHART_COMBOS = new Set<`${Mood}:${Tense}`>([
  'indicative:present',
  'indicative:preterite',
  'indicative:imperfect',
  'subjunctive:present',
  'subjunctive:imperfect',
]);

const SPECIAL_SCOPE_LABELS: Record<string, string> = {
  imper_affirm: 'Imperative (affirmative)',
  imper_neg: 'Imperative (negative)',
  gerund: 'Gerund',
  gerundio: 'Gerund',
  pp: 'Past participle',
};

const PRONOUN_LABELS: Record<keyof PronounConjugation, string> = {
  yo: 'yo',
  tu: 'tú',
  el: 'él/ella/ud.',
  nosotros: 'nosotros',
  vosotros: 'vosotros',
  ellos: 'ellos/ellas/uds.',
};

const formatMood = (mood: Mood) => (mood === 'indicative' ? 'Indicative' : 'Subjunctive');
const formatTense = (tense: Tense) =>
  tense.charAt(0).toUpperCase() + tense.slice(1);

const renderSpecialText = (text: string): React.ReactNode => {
  const parts = text.split(/(\(\(\(.*?\)\)\)|\(\(.*?\)\)|\(.*?\))/g);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith('(((') && part.endsWith(')))')) {
      return <span key={index} className="text-green-400 font-bold">{part.slice(3, -3)}</span>;
    }
    else if (part.startsWith('((') && part.endsWith('))')) {
      return <span key={index} className="text-blue-400 font-bold">{part.slice(2, -2)}</span>;
    }
    else if (part.startsWith('(') && part.endsWith(')')) {
      return <span key={index} className="text-red-400 font-bold">{part.slice(1, -1)}</span>;
    }
    return part;
  });
};

const formatSpecialLabel = (override: Extract<IrregularOverride, { kind: 'special' }>) => {
  const base = SPECIAL_SCOPE_LABELS[override.form] || override.form.replace(/_/g, ' ');
  return override.pronounLabel ? `${base} — ${override.pronounLabel}` : base;
};

const formatConjugationLabel = (override: Extract<IrregularOverride, { kind: 'conjugation' }>) => {
  const base = `${formatMood(override.mood)} ${formatTense(override.tense)}`;
  return override.pronoun ? `${base} — ${PRONOUN_LABELS[override.pronoun]}` : base;
};

const shouldSurfaceOverride = (override: IrregularOverride) => {
  if (override.kind === 'special') {
    return true;
  }
  const key = `${override.mood}:${override.tense}` as `${Mood}:${Tense}`;
  return !CORE_CHART_COMBOS.has(key);
};

export const ConjugationChart: React.FC<ConjugationChartProps> = ({ spanish, pos, tags }) => {
  const [tense, setTense] = useState<Tense>('present');
  const [mood, setMood] = useState<Mood>('indicative');

  const conjugations = useMemo(() => generateConjugations(spanish, pos, tags), [spanish, pos, tags]);
  const irregularOverrides = useMemo(() => getIrregularOverrides(tags), [tags]);
  const exceptionRows = useMemo(() => {
    return irregularOverrides
      .filter(shouldSurfaceOverride)
      .map((override, index) => {
        if (override.kind === 'special') {
          return { key: `special-${override.form}-${index}`, label: formatSpecialLabel(override), value: override.value };
        }
        return {
          key: `conj-${override.mood}-${override.tense}-${override.pronoun ?? 'all'}-${index}`,
          label: formatConjugationLabel(override),
          value: override.value,
        };
      });
  }, [irregularOverrides]);

  const cycleTense = () => {
    const currentIndex = TENSES.indexOf(tense);
    setTense(TENSES[(currentIndex + 1) % TENSES.length]);
  };

  const cycleMood = () => {
    const currentIndex = MOODS.indexOf(mood);
    setMood(MOODS[(currentIndex + 1) % MOODS.length]);
  };

  const currentConjugation = conjugations?.[mood]?.[tense];

  const renderCell = (pronoun: string, verb: string) => (
    <div className="p-3 relative h-full">
      <div className="text-sm text-slate-500 dark:text-slate-400">{pronoun}</div>
      <div className="text-lg font-semibold text-yellow-500 dark:text-yellow-300">{renderSpecialText(verb)}</div>
    </div>
  );

  return (
    <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
            <button 
                onClick={cycleTense}
                className="px-2 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors capitalize"
            >
                {tense}
            </button>
            <button 
                onClick={cycleMood}
                className="px-2 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors capitalize"
            >
                {mood}
            </button>
        </div>
      <div className="grid grid-cols-2 border border-yellow-500/50 rounded-md min-h-[218px]">
        {currentConjugation ? (
            <>
                <div className="border-r border-b border-yellow-500/50">{renderCell("yo", currentConjugation.yo)}</div>
                <div className="border-b border-yellow-500/50">{renderCell("nosotros", currentConjugation.nosotros)}</div>
                <div className="border-r border-b border-yellow-500/50">{renderCell("tú", currentConjugation.tu)}</div>
                <div className="border-b border-yellow-500/50">{renderCell("vosotros", currentConjugation.vosotros)}</div>
                <div className="border-r border-yellow-500/50">{renderCell("él/ella/ud.", currentConjugation.el)}</div>
                <div>{renderCell("ellos/ellas/uds.", currentConjugation.ellos)}</div>
            </>
        ) : (
            <div className="col-span-2 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-4">
                <div className="text-5xl font-bold text-yellow-500/70">ℹ️</div>
                <div className="mt-2 text-center text-sm">Spanish doesn’t form a preterite subjunctive, so there’s nothing to display.</div>
            </div>
        )}
      </div>
      {exceptionRows.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Exceptions</p>
          <div className="mt-2 border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-200 dark:divide-slate-700">
            {exceptionRows.map(row => (
              <div key={row.key} className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
                <span className="font-medium mr-4">{row.label}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};