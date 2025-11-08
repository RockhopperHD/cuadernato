

import React, { useState, useMemo } from 'react';
import { DictionaryEntry } from '../types';
import { BackIcon, StarIcon } from './icons';

type MasteryResetScope = 'ALL' | 'STARRED' | 'ACTIVE_LIST';

interface ViewWordsScreenProps {
    dictionaryData: DictionaryEntry[];
    activeListSet: Set<string>;
    onToggleStar: (id: string) => void;
    onSelectWord: (entry: DictionaryEntry) => void;
    onBack: () => void;
    mastery: Record<string, number>;
    onResetMastery: (scope: MasteryResetScope) => void;
}

const MasteryIndicator: React.FC<{ value: number }> = ({ value }) => {
    return (
        <div className="flex items-center gap-1" aria-label={`Mastery ${value} of 2`}>
            {[0, 1].map(index => (
                <span
                    key={index}
                    className={`inline-block h-2.5 w-2.5 rounded-full ${index < value ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                ></span>
            ))}
        </div>
    );
};

const WordItem: React.FC<{
    entry: DictionaryEntry;
    onToggleStar: (id: string) => void;
    onSelectWord: (entry: DictionaryEntry) => void;
    masteryValue: number;
}> = ({ entry, onToggleStar, onSelectWord, masteryValue }) => {
    // Determine the primary word to display. Prefers Spanish, but falls back to English.
    const primaryWord = entry.meanings[0]?.spanish?.word || entry.meanings[0]?.english?.word || 'Unknown';

    return (
        <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-700 rounded-md">
            <div className="flex flex-col flex-grow min-w-0">
                <button onClick={() => onSelectWord(entry)} className="text-left truncate hover:underline">
                    {primaryWord}
                </button>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>Mastery</span>
                    <MasteryIndicator value={masteryValue} />
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(entry.id);
                }}
                className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                aria-label={entry.starred ? 'Unstar word' : 'Star word'}
            >
                <StarIcon starred={entry.starred} className="w-5 h-5" />
            </button>
        </div>
    );
};

const WordColumn: React.FC<{
    title: string;
    words: DictionaryEntry[];
    onToggleStar: (id: string) => void;
    onSelectWord: (entry: DictionaryEntry) => void;
    mastery: Record<string, number>;
}> = ({ title, words, onToggleStar, onSelectWord, mastery }) => (
    <div className="flex flex-col bg-white dark:bg-slate-800 shadow-lg rounded-xl p-3 overflow-hidden">
        <h2 className="text-xl font-bold text-center mb-3 text-slate-800 dark:text-slate-200">{title}</h2>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2 min-h-0 bg-slate-100 dark:bg-slate-900/50 p-2 rounded-md">
            {words.length > 0 ? (
                words.map(entry => (
                    <WordItem
                        key={entry.id}
                        entry={entry}
                        onToggleStar={onToggleStar}
                        onSelectWord={onSelectWord}
                        masteryValue={mastery[entry.id] ?? 0}
                    />
                ))
            ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 pt-4">No words to display.</p>
            )}
        </div>
    </div>
);


export const ViewWordsScreen: React.FC<ViewWordsScreenProps> = ({ dictionaryData, activeListSet, onToggleStar, onSelectWord, onBack, mastery, onResetMastery }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = useMemo(() => {
        if (!searchQuery) {
            return dictionaryData;
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return dictionaryData.filter(entry =>
            entry.meanings.some(m =>
                m.spanish.word.toLowerCase().includes(lowerCaseQuery) ||
                m.english.word.toLowerCase().includes(lowerCaseQuery)
            )
        );
    }, [searchQuery, dictionaryData]);

    const starredWords = useMemo(() => filteredData.filter(entry => entry.starred).sort((a,b) => a.meanings[0].spanish.word.localeCompare(b.meanings[0].spanish.word)), [filteredData]);
    const listWords = useMemo(() => filteredData.filter(entry => activeListSet.has(entry.id)).sort((a,b) => a.meanings[0].spanish.word.localeCompare(b.meanings[0].spanish.word)), [filteredData, activeListSet]);
    const allWords = useMemo(() => [...filteredData].sort((a,b) => a.meanings[0].spanish.word.localeCompare(b.meanings[0].spanish.word)), [filteredData]);

    return (
        <div className="min-h-screen flex flex-col w-full p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <BackIcon className="w-6 h-6" />
                    </button>
                    <img src="https://via.placeholder.com/200" alt="Cuadernato Logo" className="w-10 h-10 rounded-md" />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-display">Cuadernato</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">View Words</p>
                    </div>
                </div>
                <button
                    onClick={() => onResetMastery('ALL')}
                    className="bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors"
                >
                    Reset Mastery
                </button>
            </header>
            <main className="flex-grow w-full max-w-5xl mx-auto flex flex-col gap-4 overflow-hidden" style={{ minHeight: 0 }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all words..."
                    className="w-full bg-white dark:bg-slate-800 shadow-lg placeholder-slate-400 text-lg p-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-400"
                />
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: 0 }}>
                    <WordColumn title="Starred Words" words={starredWords} onToggleStar={onToggleStar} onSelectWord={onSelectWord} mastery={mastery} />
                    <WordColumn title="Activated List" words={listWords} onToggleStar={onToggleStar} onSelectWord={onSelectWord} mastery={mastery} />
                    <WordColumn title="All Words" words={allWords} onToggleStar={onToggleStar} onSelectWord={onSelectWord} mastery={mastery} />
                </div>
            </main>
            <footer className="w-full max-w-5xl mx-auto text-center py-4 mt-4">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  © 2024 Cuadernato. All Rights Reserved. A sample application for demonstration purposes.
                </p>
            </footer>
        </div>
    );
};