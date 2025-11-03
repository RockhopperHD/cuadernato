
import React, { useState, useMemo, useEffect } from 'react';
import { DICTIONARY_DATA } from './data/dictionary';
import { DictionaryEntry, AppMode, ModalType } from './types';
import { SearchBar } from './components/SearchBar';
import { WordDetails } from './components/WordDetails';
import { RotatingTips } from './components/RotatingTips';
// Update: Removed AppLogoIcon from imports
import { SettingsIcon, BackIcon, VerticalTriangleIcon, StarIcon } from './components/icons';
import { TitleScreen } from './components/TitleScreen';
import { ImportListScreen } from './components/ImportListScreen';
import { ListActiveIndicator } from './components/ListActiveIndicator';
import { Modal } from './components/Modal';

// Update: Removed Theme type definition

const App: React.FC = () => {
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[]>(DICTIONARY_DATA);
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');
  const [query, setQuery] = useState('pato');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  // App structure state
  const [mode, setMode] = useState<AppMode>('title');
  // Update: Removed theme state. App is always in dark mode.
  const [modal, setModal] = useState<{type: ModalType, message?: string} | null>(null);
  const [passwordInput, setPasswordInput] = useState('');

  // List state
  const [activeList, setActiveList] = useState<Set<string>>(new Set());
  const [listChecksum, setListChecksum] = useState<string | null>(null);
  const [isListLocked, setIsListLocked] = useState(false);
  const [listPassword, setListPassword] = useState<string | null>(null);

  // Settings state
  const [showVulgar, setShowVulgar] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const allWordIds = useMemo(() => new Set(DICTIONARY_DATA.map(e => e.id)), []);

  // Update: Removed theme-switching useEffect

  const handleImportList = (ids: string[], checksum: string, password?: string) => {
    setActiveList(new Set(ids));
    setListChecksum(checksum);
    if (password) {
        setListPassword(password);
        setIsListLocked(true);
    }
    setMode('dictionary');
  };

  const handleRemoveList = () => {
      if (isListLocked) {
        setModal({type: 'unlockList', message: 'Enter password to remove list.'});
        return;
      }
      setActiveList(new Set());
      setListChecksum(null);
      setIsListLocked(false);
      setListPassword(null);
      setModal(null);
      setSettingsOpen(false);
  };

  const handleUnlockList = () => {
    if (passwordInput !== listPassword) {
        setModal({type: 'unlockList', message: 'Incorrect password. Try again.'});
        return;
    }
    setIsListLocked(false);
    setModal(null);
    setPasswordInput('');
    setSettingsOpen(false);
  };
  
  // Update: Removed toggleTheme function
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
  };
  
  const searchResults = useMemo(() => {
    let visibleData = dictionaryData;
    if (!showVulgar) {
        visibleData = dictionaryData.filter(entry => 
            !entry.meanings.some(m => m.spanish.tags?.includes('VULGAR'))
        );
    }

    if (!query) return [];
    const lowerCaseQuery = query.toLowerCase();
    
    const filtered = visibleData.filter(entry => {
      if (isListLocked && activeList.has(entry.id)) {
          return false; // Hide from search results if locked
      }
      const terms = new Set<string>();
      if (lang === 'ES') {
        entry.meanings.forEach(meaning => {
          terms.add(meaning.spanish.word);
          if (meaning.spanish.gender_map) {
            Object.keys(meaning.spanish.gender_map).forEach(key => terms.add(key.split('/')[0].trim()));
          }
        });
      } else { // lang === 'EN'
        entry.meanings.forEach(meaning => terms.add(meaning.english.word));
      }
      return Array.from(terms).some(term => term.toLowerCase().startsWith(lowerCaseQuery));
    });

    return filtered.sort((a, b) => {
      const aHasExactMatch = a.meanings.some(m => lang === 'ES' ? m.spanish.word.toLowerCase() === lowerCaseQuery : m.english.word.toLowerCase() === lowerCaseQuery);
      const bHasExactMatch = b.meanings.some(m => lang === 'ES' ? m.spanish.word.toLowerCase() === lowerCaseQuery : m.english.word.toLowerCase() === lowerCaseQuery);
      if (aHasExactMatch && !bHasExactMatch) return -1;
      if (!aHasExactMatch && bHasExactMatch) return 1;
      return 0;
    });

  }, [query, lang, dictionaryData, showVulgar, isListLocked, activeList]);

  useEffect(() => {
    if (query) {
        if (searchResults.length > 0) {
          if (!selectedEntry || !searchResults.find(r => r.id === selectedEntry.id)) {
            setSelectedEntry(searchResults[0]);
          }
        } else {
          setSelectedEntry(null);
        }
    } else {
        setSelectedEntry(null);
    }
  }, [query, searchResults, selectedEntry]);

  const renderModalContent = () => {
    if (!modal) return null;
    switch (modal.type) {
        case 'listInfo':
            // Update: Added 'Remove List' button to the modal.
            return (
              <div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  This icon indicates the word is on your active list.
                </p>
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => {
                            setModal(null);
                            if (isListLocked) {
                                setModal({type: 'unlockList', message: 'Unlock list before removing.'});
                            } else {
                                setModal({type: 'removeListConfirmation'});
                            }
                        }} 
                        className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700"
                    >
                        Remove Current List...
                    </button>
                    <button 
                        onClick={() => setModal(null)} 
                        className="w-full bg-slate-200 dark:bg-slate-600 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500"
                    >
                        Close
                    </button>
                </div>
              </div>
            );
        case 'lockList': // This case is no longer used for triggering, but kept for modal structure
        case 'unlockList':
            return (
                <div>
                    <p className="text-slate-600 dark:text-slate-300 mb-2">{modal.message || `Enter password to unlock the list.`}</p>
                    <input 
                        type="password" 
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md border border-slate-300 dark:border-slate-600"
                        placeholder="Password..."
                        onKeyDown={(e) => e.key === 'Enter' && handleUnlockList()}
                    />
                    <div className="flex gap-2 mt-4">
                        <button onClick={() => { setModal(null); setPasswordInput(''); }} className="w-full bg-slate-200 dark:bg-slate-600 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button onClick={handleUnlockList} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Unlock</button>
                    </div>
                </div>
            )
        case 'removeListConfirmation':
             return (
                <div>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Are you sure you want to remove the current list? This cannot be undone.</p>
                     <div className="flex gap-2 mt-4">
                        <button onClick={() => setModal(null)} className="w-full bg-slate-200 dark:bg-slate-600 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button onClick={handleRemoveList} className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700">Remove List</button>
                    </div>
                </div>
             );
    }
  };


  if (mode === 'title') {
    return <TitleScreen setMode={setMode} isListLocked={isListLocked} />;
  }
  
  if (mode === 'importList') {
    return <ImportListScreen onImport={handleImportList} onBack={() => setMode('title')} wordIds={allWordIds} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 relative">
       {modal && (
        <Modal title={
            modal.type === 'listInfo' ? 'List Information' : 
            modal.type === 'lockList' ? 'Lock List' : 
            modal.type === 'unlockList' ? 'Unlock List' :
            'Confirm Removal'
        } onClose={() => { setModal(null); setPasswordInput(''); }}>
            {renderModalContent()}
        </Modal>
      )}

      <header className="w-full max-w-4xl mx-auto flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('title')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <BackIcon className="w-6 h-6"/>
          </button>
          {/* Update: Replaced AppLogoIcon with placeholder image */}
          <img src="https://via.placeholder.com/200" alt="Cuadernato Logo" className="w-10 h-10 rounded-md" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Cuadernato</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
                if (isListLocked) {
                    setModal({ type: 'unlockList' });
                }
            }}
            disabled={!isListLocked}
            className="disabled:cursor-default"
            aria-label={isListLocked ? "Unlock active list" : "List status indicator"}
          >
            <ListActiveIndicator isActive={activeList.size > 0} isLocked={isListLocked} checksum={listChecksum} />
          </button>
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
                    <div className="relative"><input type="checkbox" className="sr-only" checked={showVulgar} onChange={() => setShowVulgar(prev => !prev)} /><div className={`block w-10 h-6 rounded-full ${showVulgar ? 'bg-indigo-600' : 'bg-slate-400 dark:bg-slate-600'}`}></div><div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showVulgar ? 'transform translate-x-4' : ''}`}></div></div>
                  </label>
                  {/* Update: Removed Light Mode and Lock/Unlock toggles */}
                  {activeList.size > 0 && <div className="border-t border-slate-200 dark:border-slate-600 my-2"></div>}
                  {activeList.size > 0 && (
                      <button onClick={() => isListLocked ? setModal({type: 'unlockList', message: 'Unlock list before removing.'}) : setModal({type: 'removeListConfirmation'})} className="w-full text-left text-sm font-medium p-2 rounded-md text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">Remove List...</button>
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
                    {searchResults.map(entry => {
                      const primaryWord = lang === 'ES' ? entry.meanings[0].spanish.word : entry.meanings[0].english.word;
                      const isWordOnList = activeList.has(entry.id);
                      return (
                        <li key={entry.id}>
                          <button
                            onClick={() => setSelectedEntry(entry)}
                            className={`w-full text-left p-4 transition-colors duration-150 flex items-center justify-between ${
                              selectedEntry?.id === entry.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <span className="font-semibold">{primaryWord}</span>
                            <span className="flex items-center gap-1">
                               {activeList.size > 0 && <VerticalTriangleIcon filled={isWordOnList} className={`w-4 h-4 ${isWordOnList ? 'text-green-400' : 'text-slate-400 dark:text-slate-600'}`}/>}
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
                    isWordOnList={activeList.has(selectedEntry.id)}
                    isListLocked={isListLocked}
                    onListIconClick={() => setModal({ type: 'listInfo' })}
                  />
                ) : query ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Didn't find anything</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                      Try another word or switch languages.
                    </p>
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
    </div>
  );
};

export default App;
