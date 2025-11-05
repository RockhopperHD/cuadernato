

import React, { useState, useMemo } from 'react';
import { DictionaryEntry } from '../types';
import { BackIcon, StarIcon } from './icons';

interface ViewWordsScreenProps {
    dictionaryData: DictionaryEntry[];
    activeListSet: Set<string>;
    onToggleStar: (id: string) => void;
    onSelectWord: (entry: DictionaryEntry) => void;
    onBack: () => void;
}

const WordItem: React.FC<{
    entry: DictionaryEntry;
    onToggleStar: (id: string) => void;
    onSelectWord: (entry: DictionaryEntry) => void;
}> = ({ entry, onToggleStar, onSelectWord }) => {
    // Determine the primary word to display. Prefers Spanish, but falls back to English.
    const primaryWord = entry.meanings[0]?.spanish?.word || entry.meanings[0]?.english?.word || 'Unknown';

    return (
        <div className="flex items-center justify-between p-2 bg-slate-200 dark:bg-slate-700 rounded-md">
            <button onClick={() => onSelectWord(entry)} className="flex-grow text-left truncate pr-2 hover:underline">
                {primaryWord}
            </button>
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
}> = ({ title, words, onToggleStar, onSelectWord }) => (
    <div className="flex flex-col bg-black/30 rounded-xl p-3 overflow-hidden">
        <h2 className="text-xl font-bold text-center mb-3 text-slate-300">{title}</h2>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2 min-h-0">
            {words.length > 0 ? (
                words.map(entry => (
                    <WordItem
                        key={entry.id}
                        entry={entry}
                        onToggleStar={onToggleStar}
                        onSelectWord={onSelectWord}
                    />
                ))
            ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 pt-4">No words to display.</p>
            )}
        </div>
    </div>
);


export const ViewWordsScreen: React.FC<ViewWordsScreenProps> = ({ dictionaryData, activeListSet, onToggleStar, onSelectWord, onBack }) => {
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
        <div className="flex flex-col h-screen w-full p-4 sm:p-6 lg:p-8 bg-[#191724] text-slate-200">
            <header className="flex items-center w-full max-w-5xl mx-auto mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                        <BackIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold">View Words</h1>
                        <p className="text-slate-400">Browse your entire word collection</p>
                    </div>
                </div>
            </header>
            <main className="flex-grow w-full max-w-5xl mx-auto flex flex-col gap-4 overflow-hidden" style={{ minHeight: 0 }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all words..."
                    className="w-full bg-black/50 text-white placeholder-slate-400 text-lg p-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500"
                />
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: 0 }}>
                    <WordColumn title="Starred Words" words={starredWords} onToggleStar={onToggleStar} onSelectWord={onSelectWord} />
                    <WordColumn title="Activated List" words={listWords} onToggleStar={onToggleStar} onSelectWord={onSelectWord} />
                    <WordColumn title="All Words" words={allWords} onToggleStar={onToggleStar} onSelectWord={onSelectWord} />
                </div>
            </main>
        </div>
    );
};