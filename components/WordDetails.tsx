

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
  matchedTerm?: string | null;
  lookupEntryById?: (id: string) => DictionaryEntry | null;
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

export const WordDetails: React.FC<WordDetailsProps> = ({
  entry,
  lang,
  onStar,
  query,
  isWordOnList,
  isListLocked,
  onListIconClick,
  matchedTerm,
  lookupEntryById,
}) => {
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

    const normalizedMatchedTerm = matchedTerm?.toLowerCase().trim() || null;

    const filterMeaningsByMatch = (meanings: DictionaryEntry['meanings']) => {
        if (!normalizedMatchedTerm) return meanings;

        const filtered = meanings.filter(meaning => {
            if (lang === 'ES') {
                const baseWord = meaning.spanish.word.toLowerCase();
                if (baseWord === normalizedMatchedTerm) {
                    return true;
                }

                const displayWord = meaning.spanish.display_word?.toLowerCase();
                if (displayWord && displayWord === normalizedMatchedTerm) {
                    return true;
                }

                if (meaning.spanish.aliases?.some(alias => alias.toLowerCase() === normalizedMatchedTerm)) {
                    return true;
                }

                if (meaning.spanish.gender_map) {
                    return Object.keys(meaning.spanish.gender_map).some(key => {
                        const genderTerm = key.split('/')[0].trim().toLowerCase();
                        return genderTerm === normalizedMatchedTerm;
                    });
                }

                return false;
            }

            return meaning.english.word.toLowerCase() === normalizedMatchedTerm;
        });

        return filtered.length > 0 ? filtered : meanings;
    };

    const sortMeanings = (meanings: DictionaryEntry['meanings']) => {
        const lowerQuery = query.toLowerCase();
        return [...meanings].sort((a, b) => {
            if (!lowerQuery) return 0;
            if (lang === 'ES') {
                const aSpanishMatches = [
                    a.spanish.word,
                    a.spanish.display_word,
                    ...(a.spanish.aliases ?? [])
                ].reduce<string[]>((accum, term) => {
                    if (term) {
                        accum.push(term.toLowerCase());
                    }
                    return accum;
                }, []);
                const bSpanishMatches = [
                    b.spanish.word,
                    b.spanish.display_word,
                    ...(b.spanish.aliases ?? [])
                ].reduce<string[]>((accum, term) => {
                    if (term) {
                        accum.push(term.toLowerCase());
                    }
                    return accum;
                }, []);
                const aMatch = aSpanishMatches.includes(lowerQuery);
                const bMatch = bSpanishMatches.includes(lowerQuery);
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
            } else {
                const aMatch = a.english.word.toLowerCase() === lowerQuery;
                const bMatch = b.english.word.toLowerCase() === lowerQuery;
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
            }
            return 0;
        });
    };

    const renderMeaningSections = (
        targetEntry: DictionaryEntry,
        options: { showControls: boolean; applyMatchFilter: boolean; accentLabel?: string; isWordOnList?: boolean }
    ) => {
        const { showControls, applyMatchFilter, accentLabel, isWordOnList: sectionWordOnList } = options;
        const baseMeanings = applyMatchFilter ? filterMeaningsByMatch(targetEntry.meanings) : targetEntry.meanings;
        const sortedMeanings = sortMeanings(baseMeanings);
        const listIconColor = isListLocked ? 'text-blue-500' : 'text-green-500';

        return (
            <article key={targetEntry.id} className="rounded-2xl bg-white dark:bg-slate-900/80 shadow border border-slate-200 dark:border-slate-800 overflow-hidden">
                {accentLabel && (
                    <div className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
                        {accentLabel}
                    </div>
                )}
                <div className="p-6 md:p-8">
                    {targetEntry.grand_note && (
                        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                            <h3 className="text-xl font-bold text-center mb-2 text-slate-900 dark:text-yellow-100">{targetEntry.grand_note.title}</h3>
                            <p className="text-slate-900 dark:text-yellow-200">{targetEntry.grand_note.description}</p>
                        </div>
                    )}
                    <div className="space-y-6">
                        {sortedMeanings.map((meaning, index) => {
                            const { spanish, english, pos, as_in } = meaning;
                            const isES = lang === 'ES';

                            const spanishDisplay = spanish.display_word ?? spanish.word;
                            const tags = meaning.tags?.visible ?? [];
                            const region = meaning.tags?.region;
                            const headerText = isES ? english.word : spanishDisplay;
                            const headerPos = pos;
                            const asInText = as_in;

                            return (
                                <div key={`${targetEntry.id}-${index}`} className="pb-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-baseline gap-3">
                                                <h2 className={`text-4xl font-extrabold ${index === 0 ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>{headerText}</h2>
                                                <span className="text-slate-500 dark:text-slate-400">{headerPos}</span>
                                                {!isES && (
                                                    <div className="flex items-center gap-2">
                                                        {region && <Tag type={region} />}
                                                        {tags.map(t => <Tag key={t} type={t} />)}
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

                                        {showControls && index === 0 && (
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={onListIconClick}
                                                    className={`${listIconColor} hover:opacity-80 transition-opacity p-2`}
                                                    aria-label="List status"
                                                >
                                                    <VerticalTriangleIcon filled={!!sectionWordOnList} className="w-8 h-8" />
                                                </button>
                                                <button
                                                    onClick={() => onStar(targetEntry.id)}
                                                    className="text-yellow-400 hover:text-yellow-300 transition-colors p-2"
                                                    aria-label={targetEntry.starred ? 'Unstar word' : 'Star word'}
                                                >
                                                    <StarIcon starred={targetEntry.starred} className="w-8 h-8" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {spanish.note && (
                                        <div className="mt-4 pl-4 border-l-2 border-sky-400/50 text-slate-600 dark:text-slate-300">
                                            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">Spanish Note</p>
                                            <p className="text-sm mt-1">{spanish.note}</p>
                                        </div>
                                    )}

                                    {english.note && (
                                        <div className="mt-4 pl-4 border-l-2 border-emerald-400/50 text-slate-600 dark:text-slate-300">
                                            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">English Note</p>
                                            <p className="text-sm mt-1">{english.note}</p>
                                        </div>
                                    )}

                                    {renderGenderMap(spanish.gender_map)}

                                    {isES && (
                                        <div className="flex items-center gap-2 mt-3">
                                            {region && <Tag type={region} />}
                                            {tags.map(t => <Tag key={t} type={t} />)}
                                        </div>
                                    )}

                                    {meaning.trailing_words && meaning.trailing_words.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Trailing Words</p>
                                            <ul className="mt-1 list-disc list-inside text-slate-600 dark:text-slate-300">
                                                {meaning.trailing_words.map((trail, idx) => (
                                                    <li key={idx}>{trail}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {pos === 'verb' && <ConjugationChart spanish={spanish} pos={pos} tags={meaning.tags} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </article>
        );
    };

    const connectedEntries = (entry.connected ?? [])
        .map(id => (lookupEntryById ? lookupEntryById(id) : null))
        .filter((maybeEntry): maybeEntry is DictionaryEntry => Boolean(maybeEntry));

    const uniqueConnectedEntries = connectedEntries.reduce<DictionaryEntry[]>((acc, next) => {
        if (!acc.find(existing => existing.id === next.id)) {
            acc.push(next);
        }
        return acc;
    }, []);

    return (
        <div className="p-4 md:p-6 lg:p-8 overflow-y-auto h-full space-y-10">
            {renderMeaningSections(entry, { showControls: true, applyMatchFilter: true, isWordOnList })}

            {uniqueConnectedEntries.length > 0 && (
                <section>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Connected words</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="mt-4 space-y-6">
                        {uniqueConnectedEntries.map(connectedEntry =>
                            renderMeaningSections(connectedEntry, {
                                showControls: false,
                                applyMatchFilter: false,
                                accentLabel: `Entry #${connectedEntry.id}`,
                            })
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};