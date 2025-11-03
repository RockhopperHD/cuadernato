
import React, { useState } from 'react';
import { AppMode, DictionaryEntry, Meaning } from '../types';
import { BackIcon, CloseIcon, WarningIcon } from './icons';
import { Modal } from './Modal';

type WordPair = {
    id: number;
    spanish: string;
    english: string;
    inDictionary: boolean;
    selectedMeaningAsIn: string; // The `as_in` from the selected Spanish meaning
    ambiguousMeanings?: Meaning[];
};

type ListBuilderModal = 'export' | 'leaveConfirm' | 'import' | 'importConfirm' | null;

const CIPHER_KEY = 'cuadernato-static-key-2024';

// A simple reversible XOR cipher for obfuscation
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
}

const Tooltip: React.FC<{text: string; children: React.ReactNode}> = ({ text, children }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-900 text-white text-xs rounded py-1 px-2 z-10">
                    {text}
                </div>
            )}
        </div>
    );
};

export const ListBuilder: React.FC<ListBuilderProps> = ({ setMode, dictionary }) => {
    const [listName, setListName] = useState('');
    const [listPassword, setListPassword] = useState('');
    const [listShowVulgar, setListShowVulgar] = useState(true);
    const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
    
    const [spanishInput, setSpanishInput] = useState('');
    const [englishInput, setEnglishInput] = useState('');
    const [modal, setModal] = useState<ListBuilderModal>(null);
    const [exportData, setExportData] = useState('');

    const [importCode, setImportCode] = useState('');
    const [importError, setImportError] = useState<string | null>(null);
    
    const hasUnsavedChanges = wordPairs.length > 0 || !!listName || !!listPassword;

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

    const handleBack = () => {
        if (hasUnsavedChanges) {
            setModal('leaveConfirm');
        } else {
            setMode('title');
        }
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
                selectedMeaningAsIn: ambiguousMeanings.length > 0 ? ambiguousMeanings[0].spanish.as_in : '',
                ambiguousMeanings: ambiguousMeanings.length > 1 ? ambiguousMeanings : undefined,
            };
            
            if (newPair.ambiguousMeanings) {
                const matchedMeaning = newPair.ambiguousMeanings.find(m => m.english.word.toLowerCase() === english.toLowerCase());
                if (matchedMeaning) {
                    newPair.selectedMeaningAsIn = matchedMeaning.spanish.as_in;
                } else {
                    newPair.english = newPair.ambiguousMeanings[0].english.word;
                    newPair.selectedMeaningAsIn = newPair.ambiguousMeanings[0].spanish.as_in;
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
                const newMeaning = p.ambiguousMeanings.find(m => m.spanish.as_in === newAsIn);
                if (newMeaning) {
                    return {
                        ...p,
                        selectedMeaningAsIn: newAsIn,
                        english: newMeaning.english.word,
                    };
                }
            }
            return p;
        }));
    };


    const removePair = (id: number) => {
        setWordPairs(wordPairs.filter(p => p.id !== id));
    };

    const handleExport = () => {
        const code = generateExportCode();
        setExportData(code);
        setModal('export');
    };
    
    const handleExportAndLeave = () => {
        const code = generateExportCode();
        navigator.clipboard.writeText(code).then(() => {
            alert('Unsaved list copied to clipboard!');
            setMode('title');
        });
    }
    
    const handleSpanishLookup = () => {
        const spanishWord = spanishInput.trim();
        if (!spanishWord) return;

        const meanings = findAmbiguousMeanings(spanishWord);
        const uniqueEnglishWords = [...new Set(meanings.map(m => m.english.word))];
        
        if (uniqueEnglishWords.length === 1) {
            setEnglishInput(uniqueEnglishWords[0]);
        }
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
            const [_, __, checksum, encodedPayload] = parts;
            
            const cipheredPayload = atob(encodedPayload);
            const payload = simpleCipher(cipheredPayload, CIPHER_KEY);
            const calculatedChecksum = payload.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0).toString();

            if (calculatedChecksum !== checksum) {
                throw new Error('Checksum mismatch. The data is corrupt.');
            }

            const data = JSON.parse(payload);
            if (!data.name || !Array.isArray(data.pairs)) {
                 throw new Error('Decrypted data is not a valid list.');
            }

            const importedPairs = data.pairs.map((p: any, i: number) => {
                const ambiguousMeanings = findAmbiguousMeanings(p.spanish);
                return {
                    id: Date.now() + i,
                    spanish: p.spanish,
                    english: p.english,
                    inDictionary: doesPairExistInDictionary(p.spanish, p.english),
                    selectedMeaningAsIn: ambiguousMeanings.find(m => m.english.word === p.english)?.spanish.as_in || '',
                    ambiguousMeanings: ambiguousMeanings.length > 1 ? ambiguousMeanings : undefined,
                };
            });

            setListName(data.name);
            setWordPairs(importedPairs);
            setListPassword(''); // Clear password
            setListShowVulgar(data.showVulgar !== undefined ? data.showVulgar : true);

            alert(`List "${data.name}" imported successfully. The list password (if any) has been removed for editing.`);
            
            setModal(null);
            setImportCode('');
            setImportError(null);
        } catch (e: any) {
            setImportError(`Import failed: ${e.message}`);
        }
    };


    const openImportModal = () => {
        if (hasUnsavedChanges) {
            setModal('importConfirm');
        } else {
            setModal('import');
        }
    }

    const renderModal = () => {
        if (!modal) return null;
        
        switch(modal) {
            case 'export':
                return (
                    <Modal title="Exported List Code" onClose={() => setModal(null)}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Copy this code to save or share your list.</p>
                        <textarea readOnly value={exportData} className="w-full h-32 p-2 font-mono bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 resize-none"/>
                        <button onClick={() => { navigator.clipboard.writeText(exportData); alert('Copied to clipboard!'); }} className="w-full mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Copy to Clipboard</button>
                    </Modal>
                );
            case 'leaveConfirm':
                 return (
                    <Modal title="Unsaved Changes" onClose={() => setModal(null)}>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">You have unsaved changes that will be lost.</p>
                         <div className="flex flex-col gap-2 mt-4">
                            <button onClick={handleExportAndLeave} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Copy Code & Leave</button>
                            <div className="flex gap-2">
                               <button onClick={() => setModal(null)} className="w-full bg-slate-200 dark:bg-slate-600 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Stay</button>
                               <button onClick={() => setMode('title')} className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700">Leave Without Saving</button>
                            </div>
                        </div>
                    </Modal>
                 );
            case 'importConfirm':
                 return (
                    <Modal title="Import Over Unsaved List?" onClose={() => setModal(null)}>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">You have unsaved changes. Importing a new list will overwrite your current work. Are you sure?</p>
                         <div className="flex gap-2 mt-4">
                            <button onClick={() => setModal(null)} className="w-full bg-slate-200 dark:bg-slate-600 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                            <button onClick={() => setModal('import')} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Import Anyway</button>
                        </div>
                    </Modal>
                 );
            case 'import':
                return (
                    <Modal title="Import List to Builder" onClose={() => setModal(null)}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Paste a `C1L:` code to edit a list.</p>
                        <textarea value={importCode} onChange={e => setImportCode(e.target.value)} className="w-full h-32 p-2 font-mono bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 resize-none"/>
                        {importError && <p className="text-red-400 text-sm mt-2">{importError}</p>}
                        <button onClick={handleAttemptImport} className="w-full mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Import</button>
                    </Modal>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#191724] text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
            {renderModal()}
            <header className="flex items-center justify-between w-full max-w-5xl mx-auto mb-6">
                <div className="flex items-center gap-4">
                     <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                        <BackIcon className="w-6 h-6"/>
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold">List Builder</h1>
                        <p className="text-slate-400">Create and share custom word lists</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={openImportModal} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-slate-500 transition-colors text-md">Import</button>
                    <button onClick={handleExport} disabled={wordPairs.length === 0} className="bg-[#564fbf] text-white font-bold py-2 px-6 rounded-xl hover:bg-[#4842a1] transition-colors text-md disabled:bg-slate-600 disabled:cursor-not-allowed">Export</button>
                </div>
            </header>

            <main className="flex-grow w-full max-w-5xl mx-auto flex flex-col gap-4 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={listName} onChange={e => setListName(e.target.value)} placeholder="List Name..." className="md:col-span-1 bg-black/50 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="password" value={listPassword} onChange={e => setListPassword(e.target.value)} placeholder="List Password (optional)..." className="md:col-span-1 bg-black/50 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <label className="md:col-span-1 flex items-center justify-center gap-2 cursor-pointer bg-black/50 p-3 rounded-xl">
                        <span className="font-medium text-slate-300">Show Vulgar Words</span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={listShowVulgar} onChange={() => setListShowVulgar(prev => !prev)} />
                            <div className={`block w-10 h-6 rounded-full ${listShowVulgar ? 'bg-indigo-600' : 'bg-slate-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${listShowVulgar ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                  </label>
                </div>
                
                <div className="flex-grow bg-black/30 p-4 rounded-xl overflow-y-auto space-y-2">
                    {wordPairs.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-slate-400">Your list is empty. Add word pairs below.</p>
                        </div>
                    ) : (
                        wordPairs.map(p => (
                            <div key={p.id} className="grid grid-cols-12 gap-2 items-center animate-fade-in">
                                <div className="col-span-5 bg-yellow-400 text-black font-semibold p-3 rounded-lg text-lg truncate">{p.spanish}</div>
                                {p.ambiguousMeanings ? (
                                    <select 
                                        value={p.selectedMeaningAsIn}
                                        onChange={(e) => handleMeaningChange(p.id, e.target.value)}
                                        className="col-span-5 bg-sky-400 text-black font-semibold p-3 rounded-lg text-lg truncate focus:outline-none focus:ring-2 focus:ring-sky-200"
                                    >
                                    {p.ambiguousMeanings.map(m => (
                                        <option key={m.spanish.as_in} value={m.spanish.as_in}>
                                            {m.english.word} ({m.spanish.as_in})
                                        </option>
                                    ))}
                                    </select>
                                ) : (
                                    <div className="col-span-5 bg-sky-400 text-black font-semibold p-3 rounded-lg text-lg truncate">{p.english}</div>
                                )}
                                <div className="col-span-2 flex justify-center items-center gap-2">
                                     {!p.inDictionary && (
                                        <Tooltip text="This word pair is not in the dictionary.">
                                            <WarningIcon className="w-6 h-6 text-yellow-400" />
                                        </Tooltip>
                                     )}
                                    <button onClick={() => removePair(p.id)} className="text-red-300 hover:text-red-500 transition-colors p-1">
                                        <CloseIcon className="w-6 h-6" strokeWidth="2.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex items-stretch gap-2 mt-2">
                    <input id="spanish-input" type="text" value={spanishInput} onChange={e => setSpanishInput(e.target.value)} onBlur={handleSpanishLookup} onKeyDown={e => { if (e.key === 'Enter') { handleSpanishLookup(); document.getElementById('english-input')?.focus(); } }} placeholder="Spanish Word..." className="flex-grow w-1/2 bg-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg" />
                    <input id="english-input" type="text" value={englishInput} onChange={e => setEnglishInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addPair(); }} placeholder="English Word..." className="flex-grow w-1/2 bg-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-lg" />
                    <button id="add-button" onClick={addPair} className="bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors text-lg">Add</button>
                </div>
            </main>
        </div>
    );
};
