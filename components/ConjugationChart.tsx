
import React, { useState } from 'react';
import { SpanishSide, Tense, Mood } from '../types';

interface ConjugationChartProps {
  spanish: SpanishSide;
}

const TENSES: Tense[] = ['present', 'preterite', 'imperfect'];
const MOODS: Mood[] = ['indicative', 'subjunctive'];

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

export const ConjugationChart: React.FC<ConjugationChartProps> = ({ spanish }) => {
  const [tense, setTense] = useState<Tense>('present');
  const [mood, setMood] = useState<Mood>('indicative');
  const { conjugations, exceptions } = spanish;

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
                <div className="text-5xl font-bold text-yellow-500/50">?</div>
                <div className="mt-2 text-center text-sm">This verb form is not available in the dictionary.</div>
            </div>
        )}
      </div>
       {exceptions && exceptions.length > 0 && (
        <div className="mt-3 p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-md border border-indigo-200 dark:border-indigo-800/50">
          <h4 className="font-bold text-sm uppercase tracking-wider text-indigo-800 dark:text-indigo-200 mb-2">Exceptions & Irregular Forms</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {exceptions.map((ex, index) => (
              <div key={index} className="flex items-baseline gap-2">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300 capitalize">{ex.type} ({ex.pronoun}):</span>
                <span className="font-mono text-lg font-bold text-indigo-500 dark:text-indigo-400">{renderSpecialText(ex.word)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};