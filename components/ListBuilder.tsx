

import React, { useState, useMemo } from 'react';
import { AppMode, DictionaryEntry, Meaning, CustomListPayload } from '../types';
import { BackIcon, CheckIcon, CloseIcon, TrashIcon, WarningIcon } from './icons';
import { Modal } from './Modal';

type WordPair = {
    id: number;
    spanish: string;
    english: string;
    inDictionary: boolean;
    selectedMeaningAsIn: string;
    ambiguousMeanings?: Meaning[];
};

type ListBuilderModal = 'export' | 'import' | 'stats' | 'clearConfirm' | null;

const CIPHER_KEY = 'cuadernato-static-key-2024';

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

const simpleCipher = (text: string, key: string): string => {
    if (!key) return text;
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
};

interface ListBuilderProps {
    setMode: (mode: AppMode) => void;
    dictionary: DictionaryEntry[];
    onActivate: (list: string[], checksum: string, name: string, password?: string, showVulgar?: boolean) => void;
}

const Tooltip: React.FC<{text: string; children: React.ReactNode}> = ({ text, children }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-900 text-white text-xs rounded py-1 px-2 z-10 pointer-events-none">
                    {text}
                </div>
            )}
        </div>
    );
};

export const ListBuilder: React.FC<ListBuilderProps> = ({ setMode, dictionary, onActivate }) => {
    const [listName, setListName] = useLocalStorage('listBuilder_name', '');
    const [listPassword, setListPassword] = useLocalStorage('listBuilder_password', '');
    const [listShowVulgar, setListShowVulgar] = useLocalStorage('listBuilder_showVulgar', true);
    const [wordPairs, setWordPairs] = useLocalStorage<WordPair[]>('listBuilder_wordPairs', []);
    
    const [spanishInput, setSpanishInput] = useState('');
    const [englishInput, setEnglishInput] = useState('');
    const [modal, setModal] = useState<ListBuilderModal>(null);
    const [exportData, setExportData] = useState('');
    const [doneMenuOpen, setDoneMenuOpen] = useState(false);
    
    const [importCode, setImportCode] = useState('');
    const [importError, setImportError] = useState<string | null>(null);

    const generateExportCode = () => {
        const payload = JSON.stringify({
            name: listName || 'Untitled List',
            pairs: wordPairs.map(({ spanish, english }) => ({ spanish, english })),
            showVulgar: listShowVulgar,
            password: listPassword,
        });
        const checksum = payload.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0).toString();
        
        const cipheredPayload = simpleCipher(payload, CIPHER_KEY);
        const encodedPayload = btoa(cipheredPayload);

        return `C1L:${!!listPassword}:${checksum}:${encodedPayload}`;
    };
    
    const doesPairExistInDictionary = (spanish: string, english: string): boolean => {
        const lowerSpanish = spanish.toLowerCase();
        const lowerEnglish = english.toLowerCase();
        for (const entry of dictionary) {
            if (entry.meanings.some(m => m.spanish.word.toLowerCase() === lowerSpanish && m.english.word.toLowerCase() === lowerEnglish)) {
                return true;
            }
        }
        return false;
    };
    
    const findAmbiguousMeanings = (spanishWord: string): Meaning[] => {
        const lowerSpanish = spanishWord.toLowerCase();
        const foundMeanings: Meaning[] = [];
        for (const entry of dictionary) {
            for (const meaning of entry.meanings) {
                if (meaning.spanish.word.toLowerCase() === lowerSpanish) {
                    foundMeanings.push(meaning);
                }
            }
        }
        return foundMeanings;
    };

    const addPair = () => {
        const spanish = spanishInput.trim();
        const english = englishInput.trim();
        if (spanish && english) {
            const ambiguousMeanings = findAmbiguousMeanings(spanish);
            const inDictionary = doesPairExistInDictionary(spanish, english);
            
            const newPair: WordPair = {
                id: Date.now(),
                spanish,
                english,
                inDictionary,
                selectedMeaningAsIn: ambiguousMeanings.length > 0 ? ambiguousMeanings[0].as_in : '',
                ambiguousMeanings: ambiguousMeanings.length > 1 ? ambiguousMeanings : undefined,
            };
            
            if (newPair.ambiguousMeanings) {
                const matchedMeaning = newPair.ambiguousMeanings.find(m => m.english.word.toLowerCase() === english.toLowerCase());
                if (matchedMeaning) {
                    newPair.selectedMeaningAsIn = matchedMeaning.as_in;
                } else {
                    newPair.english = newPair.ambiguousMeanings[0].english.word;
                    newPair.selectedMeaningAsIn = newPair.ambiguousMeanings[0].as_in;
                }
            }
            
            setWordPairs([...wordPairs, newPair]);
            setSpanishInput('');
            setEnglishInput('');
            document.getElementById('spanish-input')?.focus();
        }
    };
    
    const handleMeaningChange = (pairId: number, newAsIn: string) => {
        setWordPairs(currentPairs => currentPairs.map(p => {
            if (p.id === pairId && p.ambiguousMeanings) {
                const newMeaning = p.ambiguousMeanings.find(m => m.as_in === newAsIn);
                if (newMeaning) {
                    return { ...p, selectedMeaningAsIn: newAsIn, english: newMeaning.english.word };
                }
            }
            return p;
        }));
    };

    const removePair = (id: number) => setWordPairs(wordPairs.filter(p => p.id !== id));

    const handleExport = () => {
        const code = generateExportCode();
        setExportData(code);
        setModal('export');
        setDoneMenuOpen(false);
    };
    
    const handleSpanishLookup = () => {
        const spanishWord = spanishInput.trim();
        if (!spanishWord) return;
        const meanings = findAmbiguousMeanings(spanishWord);
        const uniqueEnglishWords = [...new Set(meanings.map(m => m.english.word))];
        if (uniqueEnglishWords.length === 1) setEnglishInput(uniqueEnglishWords[0]);
    };

    const handleAttemptImport = () => {
        setImportError(null);
        const code = importCode.trim();
        if (!code.startsWith('C1L:')) {
            setImportError('Invalid format. Code must start with "C1L:".');
            return;
        }
        try {
            const parts = code.split(':');
            if (parts.length !== 4) throw new Error('Invalid custom list format.');
            const [, , checksum, encodedPayload] = parts;
            const cipheredPayload = atob(encodedPayload);
            const payload = simpleCipher(cipheredPayload, CIPHER_KEY);
            const calculatedChecksum = payload.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0).toString();
            if (calculatedChecksum !== checksum) throw new Error('Checksum mismatch.');
            const data = JSON.parse(payload);
            if (!data.name || !Array.isArray(data.pairs)) throw new Error('Decrypted data is not a valid list.');
            const importedPairs = data.pairs.map((p: any, i: number) => ({
                id: Date.now() + i,
                spanish: p.spanish,
                english: p.english,
                inDictionary: doesPairExistInDictionary(p.spanish, p.english),
                selectedMeaningAsIn: findAmbiguousMeanings(p.spanish).find(m => m.english.word === p.english)?.as_in || '',
                ambiguousMeanings: findAmbiguousMeanings(p.spanish).length > 1 ? findAmbiguousMeanings(p.spanish) : undefined,
            }));
            setListName(data.name);
            setWordPairs(importedPairs);
            setListPassword(data.password || '');
            setListShowVulgar(data.showVulgar !== undefined ? data.showVulgar : true);
            alert(`List "${data.name}" imported successfully.`);
            setModal(null);
            setImportCode('');
            setImportError(null);
        } catch (e: any) {
            setImportError(`Import failed: ${e.message}`);
        }
    };
    
    const handleActivate = () => {
        const idSet = new Set<string>();
        for (const pair of wordPairs) {
            for (const entry of dictionary) {
                if(entry.meanings.some(m => m.spanish.word.toLowerCase() === pair.spanish.toLowerCase() && m.english.word.toLowerCase() === pair.english.toLowerCase())) {
                    idSet.add(entry.id);
                    break;
                }
            }
        }
        const ids = Array.from(idSet);
        if (ids.length === 0) {
            alert("No words in this list could be found in the dictionary to activate.");
            return;
        }
        const idSum = ids.reduce((sum, id) => sum + parseInt(id, 10), 0).toString();
        onActivate(ids, idSum, listName || 'Untitled List', listPassword, listShowVulgar);
    };

    const handleClearList = () => {
        setListName('');
        setListPassword('');
        setListShowVulgar(true);
        setWordPairs([]);
        setModal(null);
    };

    const stats = useMemo(() => {
        const notInDictionary = wordPairs.filter(p => !p.inDictionary).length;
        let verbCount = 0;
        let vulgarCount = 0;
        const seenIds = new Set();

        wordPairs.forEach(pair => {
            const entry = dictionary.find(e => e.meanings.some(m => m.spanish.word.toLowerCase() === pair.spanish.toLowerCase() && m.english.word.toLowerCase() === pair.english.toLowerCase()));
            if (entry && !seenIds.has(entry.id)) {
                if (entry.meanings.some(m => m.pos === 'verb')) verbCount++;
                if (entry.meanings.some(m => m.spanish.tags?.includes('VULGAR'))) vulgarCount++;
                seenIds.add(entry.id);
            }
        });

        return { notInDictionary, verbCount, vulgarCount };
    }, [wordPairs, dictionary]);

    const renderModal = () => {
        if (!modal) return null;
        switch(modal) {
            case 'export': return (
                <Modal title="Exported List Code" onClose={() => setModal(null)}>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Copy this code to save or share your list.</p>
                    <textarea readOnly value={exportData} className="w-full h-32 p-2 font-mono bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 resize-none"/>
                    <button onClick={() => { navigator.clipboard.writeText(exportData); alert('Copied to clipboard!'); }} className="w-full mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Copy to Clipboard</button>
                </Modal>
            );
            case 'import': return (
                <Modal title="Import List to Builder" onClose={() => setModal(null)}>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Paste a `C1L:` code to edit a list.</p>
                    <textarea value={importCode} onChange={e => setImportCode(e.target.value)} className="w-full h-32 p-2 font-mono bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 resize-none"/>
                    {importError && <p className="text-red-400 text-sm mt-2">{importError}</p>}
                    <button onClick={handleAttemptImport} className="w-full mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Import</button>
                </Modal>
            );
            case 'stats': return (
                <Modal title="List Statistics" onClose={() => setModal(null)}>
                    <div className="space-y-2 text-slate-700 dark:text-slate-300">
                        <div className="flex justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded"><span>Words on list:</span> <span className="font-bold">{wordPairs.length}</span></div>
                        <div className="flex justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded"><span>Verbs:</span> <span className="font-bold">{stats.verbCount}</span></div>
                        <div className="flex justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded"><span>Vulgar words:</span> <span className="font-bold">{stats.vulgarCount}</span></div>
                        <div className="flex justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded"><span>Not in dictionary:</span> <span className="font-bold">{stats.notInDictionary}</span></div>
                    </div>
                </Modal>
            );
            case 'clearConfirm': return (
                <Modal title="Clear List?" onClose={() => setModal(null)}>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Are you sure you want to clear the entire list? This cannot be undone.</p>
                    <div className="flex gap-2 mt-4">
                        <button onClick={() => setModal(null)} className="w-full bg-slate-200 dark:bg-slate-600 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button onClick={handleClearList} className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700">Clear List</button>
                    </div>
                </Modal>
            );
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">
            {renderModal()}
            <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMode('title')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <BackIcon className="w-6 h-6"/>
                    </button>
                    <img src="https://via.placeholder.com/200" alt="Cuadernato Logo" className="w-10 h-10 rounded-md" />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-display">Cuadernato</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">List Builder</p>
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setDoneMenuOpen(p => !p)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-md flex items-center gap-2">
                        <CheckIcon className="w-5 h-5" /> Done
                    </button>
                    {doneMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 p-1">
                            <button onClick={handleActivate} className="w-full text-left p-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Activate This List</button>
                            <button onClick={handleExport} className="w-full text-left p-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Export to Code</button>
                            <button onClick={() => setMode('title')} className="w-full text-left p-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Back to Title</button>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow w-full max-w-5xl mx-auto flex flex-col gap-4 overflow-hidden">
                <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-lg p-4 sm:p-6 flex flex-col gap-4 flex-grow overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" value={listName} onChange={e => setListName(e.target.value)} placeholder="List Name..." className="bg-slate-100 dark:bg-slate-700 placeholder-slate-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        <input type="password" value={listPassword} onChange={e => setListPassword(e.target.value)} placeholder="List Password (optional)..." className="bg-slate-100 dark:bg-slate-700 placeholder-slate-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        <label className="flex items-center justify-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Show Vulgar Words</span>
                            <div className="relative"><input type="checkbox" className="sr-only" checked={listShowVulgar} onChange={() => setListShowVulgar(p => !p)} /><div className={`block w-10 h-6 rounded-full ${listShowVulgar ? 'bg-indigo-600' : 'bg-slate-400 dark:bg-slate-600'}`}></div><div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${listShowVulgar ? 'transform translate-x-4' : ''}`}></div></div>
                      </label>
                    </div>

                    <div className="flex items-center gap-4 p-2 rounded-lg">
                        <button onClick={() => setModal('stats')} className="flex-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold py-2 px-4 rounded-md transition-colors">{wordPairs.length} Words</button>
                        <button onClick={() => setModal('import')} className="flex-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold py-2 px-4 rounded-md transition-colors">Import List...</button>
                        <button onClick={() => setModal('clearConfirm')} disabled={wordPairs.length === 0} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"><TrashIcon className="w-5 h-5"/> Clear List</button>
                    </div>
                    
                    <div className="flex-grow bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-y-auto space-y-2">
                        {wordPairs.length === 0 ? (
                            <div className="h-full flex items-center justify-center"><p className="text-slate-500 dark:text-slate-400">Your list is empty. Add word pairs below.</p></div>
                        ) : (
                            wordPairs.map(p => (
                                <div key={p.id} className="grid grid-cols-12 gap-2 items-center animate-fade-in">
                                    <div className="col-span-5 bg-yellow-200 dark:bg-yellow-800/50 text-yellow-900 dark:text-yellow-100 font-semibold p-3 rounded-lg text-lg truncate">{p.spanish}</div>
                                    {p.ambiguousMeanings ? (
                                        <select value={p.selectedMeaningAsIn} onChange={(e) => handleMeaningChange(p.id, e.target.value)} className="col-span-5 bg-sky-200 dark:bg-sky-800/50 text-sky-900 dark:text-sky-100 font-semibold p-3 rounded-lg text-lg truncate focus:outline-none focus:ring-2 focus:ring-sky-200">
                                        {p.ambiguousMeanings.map(m => (<option key={m.as_in} value={m.as_in}>{m.english.word} ({m.as_in})</option>))}
                                        </select>
                                    ) : (
                                        <div className="col-span-5 bg-sky-200 dark:bg-sky-800/50 text-sky-900 dark:text-sky-100 font-semibold p-3 rounded-lg text-lg truncate">{p.english}</div>
                                    )}
                                    <div className="col-span-2 flex justify-center items-center gap-2">
                                         {!p.inDictionary && (<Tooltip text="This word pair is not in the dictionary."><WarningIcon className="w-6 h-6 text-yellow-400" /></Tooltip>)}
                                        <button onClick={() => removePair(p.id)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 transition-colors p-1"><CloseIcon className="w-6 h-6" strokeWidth="2.5" /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex items-stretch gap-2 mt-auto pt-2">
                        <input id="spanish-input" type="text" value={spanishInput} onChange={e => setSpanishInput(e.target.value)} onBlur={handleSpanishLookup} onKeyDown={e => { if (e.key === 'Enter') { handleSpanishLookup(); document.getElementById('english-input')?.focus(); } }} placeholder="Spanish Word..." className="flex-grow w-1/2 bg-slate-100 dark:bg-slate-700 placeholder-slate-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg" />
                        <input id="english-input" type="text" value={englishInput} onChange={e => setEnglishInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addPair(); }} placeholder="English Word..." className="flex-grow w-1/2 bg-slate-100 dark:bg-slate-700 placeholder-slate-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-lg" />
                        <button id="add-button" onClick={addPair} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg">Add</button>
                    </div>
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