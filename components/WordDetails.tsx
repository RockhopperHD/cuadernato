

import React from 'react';
import { DictionaryEntry, SpanishSide } from '../types';
import { ConjugationChart } from './ConjugationChart';
import { StarIcon, GenderIcon, VerticalTriangleIcon } from './icons';
import { Tag } from './Tag';

interface WordDetailsProps {
  entry: DictionaryEntry;
  lang: 'ES' | 'EN';
  onStar: (id: string) => void;
  query: string;
  isWordOnList: boolean;
  isListLocked: boolean;
  onListIconClick: () => void;
}

const renderGenderMap = (genderMap: SpanishSide['gender_map']) => {
    if (!genderMap) return null;
    return (
        <div className="mt-4 flex items-center gap-4 text-slate-600 dark:text-slate-300">
            {Object.entries(genderMap).map(([word, gender]) => {
                return (
                    <div key={word} className="flex items-center gap-2">
                        <GenderIcon gender={gender as 'm' | 'f' | 'n'} />
                        <span>{word}</span>
                    </div>
                );
            })}
        </div>
    );
};

export const WordDetails: React.FC<WordDetailsProps> = ({ entry, lang, onStar, query, isWordOnList, isListLocked, onListIconClick }) => {
    if (!entry) return null;

    if (isListLocked && isWordOnList) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="text-9xl font-bold text-blue-300 dark:text-blue-600 select-none">✕</div>
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mt-4">Word not available</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    This word is on a locked list.
                </p>
            </div>
        );
    }

    const sortedMeanings = [...entry.meanings].sort((a, b) => {
        const lowerQuery = query.toLowerCase();
        if (lang === 'ES') {
            const aMatch = a.spanish.word.toLowerCase() === lowerQuery;
            const bMatch = b.spanish.word.toLowerCase() === lowerQuery;
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
        } else { // lang === 'EN'
            const aMatch = a.english.word.toLowerCase() === lowerQuery;
            const bMatch = b.english.word.toLowerCase() === lowerQuery;
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
        }
        return 0;
    });

    const listIconColor = isListLocked ? 'text-blue-500' : 'text-green-500';

    return (
        <div className="p-6 md:p-8 overflow-y-auto h-full">
            {entry.grand_note && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                    <h3 className="text-xl font-bold text-center mb-2 text-slate-900 dark:text-yellow-100">{entry.grand_note.title}</h3>
                    <p className="text-slate-900 dark:text-yellow-200">{entry.grand_note.description}</p>
                </div>
            )}

            <div className="space-y-6">
                {sortedMeanings.map((meaning, index) => {
                    const { spanish, english, note } = meaning;
                    const isES = lang === 'ES';
                    
                    const headerText = isES ? english.word : spanish.word;
                    const headerPos = isES ? english.pos : spanish.pos;
                    const asInText = isES ? english.as_in : spanish.as_in;

                    return (
                        <div key={index} className="pb-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-baseline gap-3">
                                        <h2 className={`text-4xl font-extrabold ${index === 0 ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>{headerText}</h2>
                                        <span className="text-slate-500 dark:text-slate-400">{headerPos}</span>
                                        {!isES && (
                                        <div className="flex items-center gap-2">
                                            {spanish.region && <Tag type={spanish.region} />}
                                            {spanish.tags?.map(t => <Tag key={t} type={t} />)}
                                        </div>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-xs font-bold px-2 py-1 rounded text-yellow-600 dark:text-yellow-500 bg-yellow-200 dark:bg-yellow-900/50">
                                            AS IN
                                        </span>
                                        <span className="ml-2 text-slate-600 dark:text-slate-300 italic">{asInText}</span>
                                    </div>
                                </div>
                                
                                {index === 0 && (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button 
                                            onClick={onListIconClick}
                                            className={`${listIconColor} hover:opacity-80 transition-opacity p-2`}
                                            aria-label="List status"
                                        >
                                            <VerticalTriangleIcon filled={isWordOnList} className="w-8 h-8"/>
                                        </button>
                                        <button 
                                            onClick={() => onStar(entry.id)} 
                                            className="text-yellow-400 hover:text-yellow-300 transition-colors p-2"
                                            aria-label={entry.starred ? 'Unstar word' : 'Star word'}
                                        >
                                            <StarIcon starred={entry.starred} className="w-8 h-8"/>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {note && (
                              <div className="mt-4 pl-4 border-l-2 border-indigo-400/50 text-slate-500 dark:text-slate-400 italic">
                                {note}
                              </div>
                            )}

                            {renderGenderMap(spanish.gender_map)}
                            
                            {isES && (
                              <div className="flex items-center gap-2 mt-3">
                                {spanish.region && <Tag type={spanish.region} />}
                                {spanish.tags?.map(t => <Tag key={t} type={t} />)}
                              </div>
                            )}
                            
                            {spanish.conjugations && <ConjugationChart conjugations={spanish.conjugations} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};