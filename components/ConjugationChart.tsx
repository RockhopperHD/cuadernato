
import React, { useState } from 'react';
// Fix: Replaced non-existent type 'SpanishWordDefinition' with the correct type 'SpanishSide'.
import { SpanishSide, Tense, Mood } from '../types';

interface ConjugationChartProps {
  // Fix: Used 'SpanishSide' to correctly type the 'conjugations' prop.
  conjugations: NonNullable<SpanishSide['conjugations']>;
}

const TENSES: Tense[] = ['present', 'preterite', 'imperfect'];
const MOODS: Mood[] = ['indicative', 'subjunctive'];

const renderSpecialText = (text: string): React.ReactNode => {
  // This regex splits the string by special patterns for reflexive verbs, stem changes, and irregularities, keeping the patterns.
  // e.g., 't((ie))ne' -> ['t', '((ie))', 'ne']
  const parts = text.split(/(\(\(\(.*?\)\)\)|\(\(.*?\)\)|\(.*?\))/g);

  return parts.map((part, index) => {
    if (!part) return null; // The split can result in empty strings, which we can ignore.

    // Reflexive: (((me))) -> <span class="green">me</span>
    if (part.startsWith('(((') && part.endsWith(')))')) {
      return <span key={index} className="text-green-400 font-bold">{part.slice(3, -3)}</span>;
    }
    // Stem change: ((ie)) -> <span class="blue">ie</span>
    else if (part.startsWith('((') && part.endsWith('))')) {
      return <span key={index} className="text-blue-400 font-bold">{part.slice(2, -2)}</span>;
    }
    // Irregularity: (go) -> <span class="red">go</span>
    else if (part.startsWith('(') && part.endsWith(')')) {
      return <span key={index} className="text-red-400 font-bold">{part.slice(1, -1)}</span>;
    }
    return part;
  });
};


const ConjugationCell: React.FC<{ pronoun: string; verb: string }> = ({ pronoun, verb }) => (
  <div className="p-3">
    <div className="text-sm text-slate-500 dark:text-slate-400">{pronoun}</div>
    <div className="text-lg font-semibold text-yellow-500 dark:text-yellow-300">{renderSpecialText(verb)}</div>
  </div>
);

export const ConjugationChart: React.FC<ConjugationChartProps> = ({ conjugations }) => {
  const [tense, setTense] = useState<Tense>('present');
  const [mood, setMood] = useState<Mood>('indicative');

  const cycleTense = () => {
    const currentIndex = TENSES.indexOf(tense);
    setTense(TENSES[(currentIndex + 1) % TENSES.length]);
  };

  const cycleMood = () => {
    const currentIndex = MOODS.indexOf(mood);
    setMood(MOODS[(currentIndex + 1) % MOODS.length]);
  };

  const currentConjugation = conjugations[mood]?.[tense];

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
                <div className="border-r border-b border-yellow-500/50"><ConjugationCell pronoun="yo" verb={currentConjugation.yo} /></div>
                <div className="border-b border-yellow-500/50"><ConjugationCell pronoun="nosotros" verb={currentConjugation.nosotros} /></div>
                <div className="border-r border-b border-yellow-500/50"><ConjugationCell pronoun="tú" verb={currentConjugation.tu} /></div>
                <div className="border-b border-yellow-500/50"><ConjugationCell pronoun="vosotros" verb={currentConjugation.vosotros} /></div>
                <div className="border-r border-yellow-500/50"><ConjugationCell pronoun="él/ella/ud." verb={currentConjugation.el} /></div>
                <div><ConjugationCell pronoun="ellos/ellas/uds." verb={currentConjugation.ellos} /></div>
            </>
        ) : (
            <div className="col-span-2 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-4">
                <div className="text-5xl font-bold text-yellow-500/50">?</div>
                <div className="mt-2 text-center text-sm">This verb form is not available in the dictionary.</div>
            </div>
        )}
      </div>
    </div>
  );
};