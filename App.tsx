


// Temporary comment to refresh PR
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { DICTIONARY_DATA } from './data/dictionary';
import { DictionaryEntry, AppMode, ModalType } from './types';
import { SearchBar } from './components/SearchBar';
import { WordDetails } from './components/WordDetails';
import { RotatingTips } from './components/RotatingTips';
import { SettingsIcon, BackIcon, VerticalTriangleIcon, StarIcon } from './components/icons';
import { TitleScreen } from './components/TitleScreen';
import { ListActiveIndicator } from './components/ListActiveIndicator';
import { Modal } from './components/Modal';
import { AccentPalette } from './components/AccentPalette';
import { ListBuilder } from './components/ListBuilder';
import { ViewWordsScreen } from './components/ViewWordsScreen';
import { VocabPractice } from './components/VocabPractice';
import { EntryTester } from './components/EntryTester';

// Helper to remove accents from a string for comparison
const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const hasDiacritics = (term: string): boolean => removeAccents(term) !== term;

const compareWithAccentPreference = (a: string, b: string, preferPlain: boolean): number => {
  if (preferPlain) {
    const aHasAccent = hasDiacritics(a);
    const bHasAccent = hasDiacritics(b);
    if (aHasAccent !== bHasAccent) {
      return aHasAccent ? 1 : -1;
    }
  }
  return a.localeCompare(b);
};

// Custom hook for localStorage state
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}


const App: React.FC = () => {
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[]>(DICTIONARY_DATA);
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');
  const [query, setQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [viewingWordEntry, setViewingWordEntry] = useState<DictionaryEntry | null>(null);

  // App structure state
  const [mode, setMode] = useState<AppMode>('title');
  const [modal, setModal] = useState<{type: ModalType, subview?: 'main' | 'unlock' | 'lock' | 'removeConfirm'} | null>(null);
  const [passwordInput, setPasswordInput] = useState('');

  // List state with localStorage persistence
  const [activeList, setActiveList] = useLocalStorage<string[]>('activeList', []);
  const [listName, setListName] = useLocalStorage<string | null>('listName', null);
  const [listChecksum, setListChecksum] = useLocalStorage<string | null>('listChecksum', null);
  const [isListLocked, setIsListLocked] = useLocalStorage<boolean>('isListLocked', false);
  const [listPassword, setListPassword] = useLocalStorage<string | null>('listPassword', null);
  const [listActivationTimestamp, setListActivationTimestamp] = useLocalStorage<number | null>('listActivationTimestamp', null);
  const [listLockTimestamp, setListLockTimestamp] = useLocalStorage<number | null>('listLockTimestamp', null);
  const [listShowVulgar, setListShowVulgar] = useLocalStorage<boolean | null>('listShowVulgar', null);
  const [vocabMastery, setVocabMastery] = useLocalStorage<Record<string, number>>('vocabMastery', {});
  const activeListSet = useMemo(() => new Set(activeList), [activeList]);

  const spanishHeadwordSet = useMemo(() => {
    const set = new Set<string>();
    dictionaryData.forEach(entry => {
      entry.meanings.forEach(meaning => {
        set.add(meaning.spanish.word.toLowerCase());
      });
    });
    return set;
  }, [dictionaryData]);

  const entryLookup = useMemo(() => {
    const map = new Map<string, DictionaryEntry>();
    dictionaryData.forEach(item => {
      map.set(item.id, item);
    });
    return map;
  }, [dictionaryData]);

  const lookupEntryById = useCallback((id: string) => entryLookup.get(id) ?? null, [entryLookup]);

  // Settings state
  const [showVulgar, setShowVulgar] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const handleActivateList = (ids: string[], checksum: string, name: string, password?: string, showVulgar?: boolean) => {
    const displayChecksum = (parseInt(checksum, 10) % 10000000).toString().slice(0, 7);
    setActiveList(ids);
    setListName(name);
    setListChecksum(displayChecksum);
    setListActivationTimestamp(Date.now());
    
    // Reset lock state when activating a new list
    setIsListLocked(false);
    setListLockTimestamp(null);
    setListPassword(password || null); // Store password if provided
    setListShowVulgar(showVulgar !== undefined ? showVulgar : true);

    setMode('dictionary');
  };

  const handleDeactivateList = () => {
      setActiveList([]);
      setListName(null);
      setListChecksum(null);
      setIsListLocked(false);
      setListPassword(null);
      setListActivationTimestamp(null);
      setListLockTimestamp(null);
      setListShowVulgar(null);
      setModal(null);
      setPasswordInput('');
  };
  
  const handleUnlockList = () => {
    const hoursLocked = listLockTimestamp ? (Date.now() - listLockTimestamp) / (1000 * 60 * 60) : 0;
    if (hoursLocked >= 2) { // Override logic
        setIsListLocked(false);
        setListLockTimestamp(null);
        setModal(null);
        setPasswordInput('');
        return;
    }

    if (listPassword && passwordInput === listPassword) { // Correct password logic
        setIsListLocked(false);
        setListLockTimestamp(null);
        setModal(null);
        setPasswordInput('');
        return;
    }
    
    alert('Incorrect password. Try again.');
  };

  const handleLockList = () => {
      if (!isListLocked && listPassword) {
          setIsListLocked(true);
          setListLockTimestamp(Date.now());
      }
      setModal(null);
  }

  type MasteryResetScope = 'ALL' | 'STARRED' | 'ACTIVE_LIST';

  const handleUpdateMastery = (entryId: string, newValue: number) => {
    setVocabMastery(prev => {
      const next = { ...prev };
      if (newValue <= 0) {
        delete next[entryId];
      } else {
        next[entryId] = newValue;
      }
      return next;
    });
  };

  const handleResetMastery = (scope: MasteryResetScope) => {
    if (scope === 'ALL') {
      setVocabMastery({});
      return;
    }

    setVocabMastery(prev => {
      const next = { ...prev } as Record<string, number>;
      if (scope === 'STARRED') {
        dictionaryData.forEach(entry => {
          if (entry.starred) {
            delete next[entry.id];
          }
        });
        return next;
      }

      const activeSet = new Set(activeList);
      activeSet.forEach(id => {
        delete next[id];
      });

      return next;
    });
  };
  
  const toggleLang = () => {
    setLang(prev => (prev === 'ES' ? 'EN' : 'ES'));
    setQuery('');
    setSelectedEntry(null);
  };

  const toggleStar = (idToToggle: string) => {
    setDictionaryData(prevData =>
      prevData.map(entry =>
        entry.id === idToToggle ? { ...entry, starred: !entry.starred } : entry
      )
    );
    if (selectedEntry && selectedEntry.id === idToToggle) {
        setSelectedEntry(prev => prev ? {...prev, starred: !prev.starred} : null);
    }
    if (viewingWordEntry && viewingWordEntry.id === idToToggle) {
        setViewingWordEntry(prev => prev ? {...prev, starred: !prev.starred} : null);
    }
  };
  
  type SearchResult = {
    entry: DictionaryEntry;
    matchedMeaningIndex: number;
    matchedTerm: string;
    matchedExact: boolean;
  };

  const searchResults = useMemo<SearchResult[]>(() => {
    let visibleData = dictionaryData;
    const isVulgarFilterActive = activeListSet.size > 0 
      ? listShowVulgar === false 
      : !showVulgar;

    if (isVulgarFilterActive) {
        visibleData = dictionaryData.filter(entry =>
            !entry.meanings.some(m => m.tags?.visible?.includes('VULGAR'))
        );
    }

    if (!query) return [];
    const lowerCaseQuery = query.toLowerCase();
    const normalizedQuery = removeAccents(lowerCaseQuery);
    const preferPlainLetters = lowerCaseQuery === normalizedQuery;

    const filtered = visibleData.reduce<SearchResult[]>((acc, entry) => {
      if (isListLocked && activeListSet.has(entry.id)) {
        return acc; // Hide from search results if locked
      }

      type CandidateMatch = {
        meaningIndex: number;
        displayTerm: string;
        matchedTerm: string;
        matchedExact: boolean;
        isPrimary: boolean;
      };

      const matches: CandidateMatch[] = [];

      entry.meanings.forEach((meaning, meaningIndex) => {
        if (lang === 'ES') {
          const primaryTerm = meaning.spanish.word;
          const primaryLower = primaryTerm.toLowerCase();
          const normalizedPrimary = removeAccents(primaryLower);
          const displayTerm = meaning.spanish.display_word ?? primaryTerm;
          const aliasTerms = meaning.spanish.aliases ?? [];

          if (primaryLower.startsWith(lowerCaseQuery)) {
            matches.push({
              meaningIndex,
              displayTerm,
              matchedTerm: primaryTerm,
              matchedExact: primaryLower === lowerCaseQuery,
              isPrimary: true,
            });
          }

          if (
            !matches.some(match => match.meaningIndex === meaningIndex && match.isPrimary) &&
            normalizedQuery.startsWith(normalizedPrimary)
          ) {
            matches.push({
              meaningIndex,
              displayTerm,
              matchedTerm: primaryTerm,
              matchedExact: primaryLower === lowerCaseQuery,
              isPrimary: true,
            });
          }

          if (meaning.spanish.gender_map) {
            Object.keys(meaning.spanish.gender_map).forEach(key => {
              const genderTerm = key.split('/')[0].trim();
              if (!genderTerm) return;
              const genderLower = genderTerm.toLowerCase();
              if (!genderLower.startsWith(lowerCaseQuery)) {
                return;
              }

              if (genderLower !== primaryLower && spanishHeadwordSet.has(genderLower)) {
                return;
              }

              matches.push({
                meaningIndex,
                displayTerm,
                matchedTerm: genderTerm,
                matchedExact: genderLower === lowerCaseQuery,
                isPrimary: genderLower === primaryLower,
              });
            });
          }

          aliasTerms.forEach(alias => {
            const aliasTerm = alias.trim();
            if (!aliasTerm) {
              return;
            }
            const aliasLower = aliasTerm.toLowerCase();
            const normalizedAlias = removeAccents(aliasLower);

            if (!aliasLower.startsWith(lowerCaseQuery) && !normalizedAlias.startsWith(normalizedQuery)) {
              return;
            }

            matches.push({
              meaningIndex,
              displayTerm,
              matchedTerm: aliasTerm,
              matchedExact: aliasLower === lowerCaseQuery,
              isPrimary: aliasLower === primaryLower,
            });
          });
        } else {
          const primaryTerm = meaning.english.word;
          if (primaryTerm.toLowerCase().startsWith(lowerCaseQuery)) {
            matches.push({
              meaningIndex,
              displayTerm: primaryTerm,
              matchedTerm: primaryTerm,
              matchedExact: primaryTerm.toLowerCase() === lowerCaseQuery,
              isPrimary: true,
            });
          }
        }
      });

      if (matches.length === 0) {
        return acc;
      }

      matches.sort((a, b) => {
        if (a.matchedExact && !b.matchedExact) return -1;
        if (!a.matchedExact && b.matchedExact) return 1;
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return compareWithAccentPreference(
          a.matchedTerm.toLowerCase(),
          b.matchedTerm.toLowerCase(),
          preferPlainLetters
        );
      });

      const bestMatch = matches[0];

      // Special handling for the 'ser'/'estar' entry
      if (entry.id === '13' && lang === 'ES' && (lowerCaseQuery === 'ser' || lowerCaseQuery === 'estar')) {
        const relevantMeaningIndex = entry.meanings.findIndex(m => m.spanish.word === lowerCaseQuery);
        if (relevantMeaningIndex !== -1) {
          acc.push({
            entry: {
              ...entry,
              meanings: [entry.meanings[relevantMeaningIndex]],
              grand_note: undefined,
            },
            matchedMeaningIndex: 0,
            matchedTerm: entry.meanings[relevantMeaningIndex].spanish.word,
            matchedExact: true,
          });
          return acc;
        }
      }

      acc.push({
        entry,
        matchedMeaningIndex: bestMatch.meaningIndex,
        matchedTerm: bestMatch.displayTerm,
        matchedExact: bestMatch.matchedExact,
      });

      return acc;
    }, []);

    return filtered.sort((a, b) => {
      if (a.matchedExact && !b.matchedExact) return -1;
      if (!a.matchedExact && b.matchedExact) return 1;
      return compareWithAccentPreference(
        a.matchedTerm.toLowerCase(),
        b.matchedTerm.toLowerCase(),
        preferPlainLetters
      );
    });

  }, [query, lang, dictionaryData, showVulgar, isListLocked, activeListSet, listShowVulgar, spanishHeadwordSet]);

  const selectedSearchMatch = useMemo(() => {
    if (!selectedEntry) {
      return null;
    }
    return searchResults.find(result => result.entry.id === selectedEntry.id) || null;
  }, [selectedEntry, searchResults]);

  const suggestion = useMemo(() => {
    if (lang !== 'ES' || !query || searchResults.length > 0) {
      return null;
    }

    const lowerCaseQuery = query.toLowerCase();
    const queryWithoutAccents = removeAccents(lowerCaseQuery);
    
    // Only suggest if the user's query is accent-less.
    if (lowerCaseQuery !== queryWithoutAccents) {
        return null;
    }

    // Find the first dictionary entry that matches the query without accents
    for (const entry of DICTIONARY_DATA) {
        for (const meaning of entry.meanings) {
            const spanishWord = meaning.spanish.word;
            if (removeAccents(spanishWord.toLowerCase()) === queryWithoutAccents && spanishWord.toLowerCase() !== queryWithoutAccents) {
                return spanishWord; 
            }
        }
    }

    return null;
  }, [query, lang, searchResults]);

  useEffect(() => {
    if (query) {
        if (searchResults.length > 0) {
          if (!selectedEntry || !searchResults.find(r => r.entry.id === selectedEntry.id)) {
            setSelectedEntry(searchResults[0].entry);
          }
        } else {
          setSelectedEntry(null);
        }
    } else {
      setSelectedEntry(null);
    }
  }, [query, searchResults, selectedEntry]);

  const renderSuggestion = (suggestionText: string) => {
    const queryWithoutAccents = removeAccents(query.toLowerCase());
    if (suggestionText.length !== queryWithoutAccents.length) return suggestionText;

    return suggestionText.split('').map((char, index) => {
      const queryChar = queryWithoutAccents[index];
      // Highlight if the character is different but matches when accents are removed
      if (queryChar && char.toLowerCase() !== queryChar.toLowerCase() && removeAccents(char.toLowerCase()) === queryChar.toLowerCase()) {
        return <span key={index} className="text-yellow-500 dark:text-yellow-400">{char}</span>;
      }
      return char;
    });
  };

  const renderModalContent = () => {
    if (!modal) return null;

    const formatTimeAgo = (timestamp: number | null): string => {
        if (!timestamp) return 'N/A';
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const currentSubview = modal.subview || 'main';

    if (currentSubview === 'unlock') {
        const hoursLocked = listLockTimestamp ? (Date.now() - listLockTimestamp) / (1000 * 60 * 60) : 0;
        const canOverride = hoursLocked >= 2;
        const timeRemaining = listLockTimestamp ? Math.max(0, 2 - hoursLocked) : 2;
        const hoursRemaining = Math.floor(timeRemaining);
        const minutesRemaining = Math.floor((timeRemaining - hoursRemaining) * 60);

         return (
            <div>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                    {canOverride ? 'The lock can be overridden now.' : 'Enter password to unlock.'}
                </p>
                <input 
                    type="password" 
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md border border-slate-300 dark:border-slate-600 disabled:opacity-50"
                    placeholder="Password..."
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlockList()}
                    autoFocus
                    disabled={canOverride}
                />
                 {!canOverride && listLockTimestamp && (
                    <p className="text-xs text-center text-slate-500 mt-2">
                        Override available in {hoursRemaining}h {minutesRemaining}m.
                    </p>
                )}
                <div className="flex gap-2 mt-4">
                    <button onClick={() => setModal({ type: 'listStatus', subview: 'main' })} className="w-full bg-slate-200 dark:bg-slate-600 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Back</button>
                    <button onClick={handleUnlockList} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800" disabled={!canOverride && !passwordInput}>
                        {canOverride ? 'Override Lock' : 'Unlock'}
                    </button>
                </div>
            </div>
         );
    }

    if (currentSubview === 'removeConfirm') {
        return (
            <div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Are you sure you want to deactivate the current list? This cannot be undone.</p>
                 <div className="flex gap-2 mt-4">
                    <button onClick={() => setModal({ type: 'listStatus', subview: 'main' })} className="w-full bg-slate-200 dark:bg-slate-600 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                    <button onClick={handleDeactivateList} className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700">Deactivate List</button>
                </div>
            </div>
        );
    }
    
    // Main view
    return (
      <div className="space-y-3">
          {activeListSet.size > 0 ? (
            <>
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-500 dark:text-slate-400">List Name</p>
                  <p className="font-mono text-lg font-semibold">{listName || 'Untitled List'}</p>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-500 dark:text-slate-400">List ID / Checksum</p>
                  <p className="font-mono text-lg font-semibold">{listChecksum || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Activated For</p>
                  <p className="font-semibold">{formatTimeAgo(listActivationTimestamp)}</p>
              </div>

               {isListLocked && listLockTimestamp && (
                  <>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <p className="text-sm text-blue-500 dark:text-blue-400">Locked At</p>
                          <p className="font-semibold text-blue-800 dark:text-blue-200">{new Date(listLockTimestamp).toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <p className="text-sm text-blue-500 dark:text-blue-400">Locked For</p>
                          <p className="font-semibold text-blue-800 dark:text-blue-200">{formatTimeAgo(listLockTimestamp)}</p>
                      </div>
                  </>
              )}

              <div className="pt-2 flex flex-col gap-2">
                 {isListLocked ? (
                     <button onClick={() => setModal({ type: 'listStatus', subview: 'unlock' })} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Unlock List...</button>
                 ) : listPassword && (
                      <button onClick={handleLockList} className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">Lock List</button>
                 )}
                 <button onClick={() => setModal({ type: 'listStatus', subview: 'removeConfirm' })} className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700">Deactivate List...</button>
              </div>
            </>
          ) : (
             <div className="text-center">
                <p className="text-slate-500 dark:text-slate-400 mb-4">No list is currently activated.</p>
                <button 
                    onClick={() => { setModal(null); setMode('listBuilder'); }}
                    className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Create a List
                </button>
            </div>
          )}

          <button onClick={() => setModal(null)} className="mt-2 w-full bg-slate-200 dark:bg-slate-600 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">
              Close
          </button>
      </div>
    );
  };


  if (mode === 'title') {
    return (
      <>
        <TitleScreen setMode={setMode} />
        <AccentPalette />
      </>
    );
  }

  if (mode === 'listBuilder') {
    return (
      <>
        <ListBuilder
          setMode={setMode}
          dictionary={dictionaryData}
          onActivate={handleActivateList}
        />
        <AccentPalette />
      </>
    );
  }

  const modalVariant = isListLocked ? 'blue' : activeListSet.size > 0 ? 'green' : 'gray';

  if (mode === 'vocabPractice') {
    return (
      <>
        <VocabPractice
          dictionaryData={dictionaryData}
          mastery={vocabMastery}
          onUpdateMastery={handleUpdateMastery}
          onResetMastery={handleResetMastery}
          onBack={() => setMode('title')}
          activeList={activeList}
        />
        <AccentPalette />
      </>
    );
  }

  if (mode === 'viewWords') {
    return (
      <>
        <ViewWordsScreen
            dictionaryData={dictionaryData}
            activeListSet={activeListSet}
            onToggleStar={toggleStar}
            onSelectWord={(entry) => setViewingWordEntry(entry)}
            onBack={() => setMode('title')}
            mastery={vocabMastery}
            onResetMastery={handleResetMastery}
        />
        {modal && modal.type === 'listStatus' && (
          <Modal
            title="List Status"
            onClose={() => { setModal(null); setPasswordInput(''); }}
            variant={modalVariant}
          >
              {renderModalContent()}
          </Modal>
        )}
        {viewingWordEntry && (
            <Modal title="Word Details" onClose={() => setViewingWordEntry(null)}>
                <div className="max-h-[70vh] overflow-y-auto -m-6">
                    <WordDetails
                          entry={viewingWordEntry}
                          lang={'EN'} // Default to EN view for simplicity, as query isn't available
                          onStar={toggleStar}
                          query={''}
                          isWordOnList={activeListSet.has(viewingWordEntry.id)}
                          isListLocked={isListLocked}
                          onListIconClick={() => {
                            setViewingWordEntry(null);
                            setModal({ type: 'listStatus' });
                          }}
                          lookupEntryById={lookupEntryById}
                    />
                </div>
            </Modal>
        )}
        <AccentPalette />
      </>
    );
  }

  if (mode === 'entryTester') {
    return (
      <>
        <EntryTester
          dictionaryData={dictionaryData}
          onBack={() => setMode('title')}
        />
        <AccentPalette />
      </>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 relative">
       {modal && modal.type === 'listStatus' && (
        <Modal
          title="List Status"
          onClose={() => { setModal(null); setPasswordInput(''); }}
          variant={modalVariant}
        >
            {renderModalContent()}
        </Modal>
      )}

      {viewingWordEntry && (
          <Modal title="Word Details" onClose={() => setViewingWordEntry(null)}>
              <div className="max-h-[70vh] overflow-y-auto -m-6">
                  <WordDetails
                        entry={viewingWordEntry}
                        lang={'EN'} // Default to EN view for simplicity, as query isn't available
                        onStar={toggleStar}
                        query={''}
                        isWordOnList={activeListSet.has(viewingWordEntry.id)}
                        isListLocked={isListLocked}
                        onListIconClick={() => {
                          setViewingWordEntry(null);
                          setModal({ type: 'listStatus' });
                        }}
                        lookupEntryById={lookupEntryById}
                  />
              </div>
          </Modal>
      )}

      <header className="w-full max-w-4xl mx-auto flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('title')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <BackIcon className="w-6 h-6"/>
          </button>
          <img src="https://via.placeholder.com/200" alt="Cuadernato Logo" className="w-10 h-10 rounded-md" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-display">Cuadernato</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Dictionary</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ListActiveIndicator 
            isActive={activeListSet.size > 0} 
            isLocked={isListLocked} 
            checksum={listChecksum}
            onClick={() => setModal({ type: 'listStatus' })}
          />
          <div className="relative">
            <button 
              onClick={() => setSettingsOpen(prev => !prev)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Open settings"
            >
              <SettingsIcon className="w-6 h-6"/>
            </button>
            {settingsOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 p-2">
                  <label className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Vulgar Words</span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={showVulgar} 
                        onChange={() => setShowVulgar(prev => !prev)}
                        disabled={activeListSet.size > 0}
                        title={activeListSet.size > 0 ? "This setting is controlled by the active list." : ""}
                      />
                      <div className={`block w-10 h-6 rounded-full ${showVulgar ? 'bg-indigo-600' : 'bg-slate-400 dark:bg-slate-600'} ${activeListSet.size > 0 ? 'opacity-50' : ''}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showVulgar ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                  {activeListSet.size > 0 && <div className="border-t border-slate-200 dark:border-slate-600 my-2"></div>}
                  {activeListSet.size > 0 && (
                      <button onClick={() => setModal({ type: 'listStatus' })} className="w-full text-left text-sm font-medium p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Manage Active List...</button>
                  )}
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-lg overflow-hidden" style={{ minHeight: '70vh', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <SearchBar query={query} setQuery={setQuery} lang={lang} toggleLang={toggleLang} />
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              <aside className="w-full md:w-1/3 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                <nav>
                  <ul>
                    {searchResults.map(({ entry, matchedMeaningIndex, matchedTerm }) => {
                      const meaning = entry.meanings[matchedMeaningIndex] || entry.meanings[0];
                      const primaryWord = lang === 'ES'
                        ? (meaning.spanish.display_word ?? meaning.spanish.word)
                        : meaning.english.word;
                      const isWordOnList = activeListSet.has(entry.id);
                      return (
                        <li key={entry.id}>
                          <button
                            onClick={() => setSelectedEntry(entry)}
                            className={`w-full text-left p-4 transition-colors duration-150 flex items-center justify-between ${
                              selectedEntry?.id === entry.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <span className="font-semibold">{primaryWord === matchedTerm ? primaryWord : matchedTerm}</span>
                            <span className="flex items-center gap-1">
                               {activeListSet.size > 0 && <VerticalTriangleIcon filled={isWordOnList} className={`w-4 h-4 ${isWordOnList ? (isListLocked ? 'text-blue-400' : 'text-green-400') : 'text-slate-400 dark:text-slate-600'}`}/>}
                               {entry.starred && <StarIcon starred={true} className={`w-4 h-4 ${selectedEntry?.id === entry.id ? 'text-white' : 'text-yellow-400'}`}/>}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </aside>
              <main className="w-full md:w-2/3 bg-slate-50 dark:bg-[#181f33] flex-grow overflow-y-auto">
                {selectedEntry ? (
                  <WordDetails
                    entry={selectedEntry}
                    lang={lang}
                    onStar={toggleStar}
                    query={query}
                    isWordOnList={activeListSet.has(selectedEntry.id)}
                    isListLocked={isListLocked}
                    onListIconClick={() => setModal({ type: 'listStatus' })}
                    matchedTerm={selectedSearchMatch?.matchedTerm ?? null}
                    lookupEntryById={lookupEntryById}
                  />
                ) : query ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Didn't find anything</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                      Try another word or switch languages.
                    </p>
                    {suggestion && (
                      <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <button 
                          onClick={() => setQuery(suggestion)}
                          className="text-lg text-slate-700 dark:text-slate-200"
                        >
                          Did you mean <span className="font-bold italic">{renderSuggestion(suggestion)}</span>?
                        </button>
                      </div>
                    )}
                    <button onClick={toggleLang} className="mt-4 text-yellow-500 dark:text-yellow-400 hover:underline">
                      Did you mean to search in {lang === 'ES' ? 'English' : 'Spanish'}?
                    </button>
                  </div>
                ) : (
                  <RotatingTips lang={lang} />
                )}
              </main>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-4xl mx-auto text-center py-4 mt-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © 2024 Cuadernato. All Rights Reserved. A sample application for demonstration purposes.
        </p>
      </footer>
      <AccentPalette />
    </div>
  );
};

export default App;