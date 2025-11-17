
import React, { useState, useMemo } from 'react';
import { DictionaryEntry, CustomListPayload } from '../types';
import { BackIcon } from './icons';
import { normalizeEntryId } from '../utils/entryIds';

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

interface ImportListScreenProps {
  onImport: (list: string[], checksum: string, name: string, password?: string, showVulgar?: boolean) => void;
  onBack: () => void;
  dictionary: DictionaryEntry[];
}

export const ImportListScreen: React.FC<ImportListScreenProps> = ({ onImport, onBack, dictionary }) => {
  const [listCode, setListCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const wordIdSet = useMemo(() => new Set(dictionary.map(e => e.id)), [dictionary]);

  const handleDictionaryImport = (code: string) => {
    const importRegex = /^(.*)=(\d+)$/;
    const match = code.match(importRegex);

    if (!match) {
      setError('Invalid format. Must be "1,2=3".');
      return;
    }
    const [, idStr, checksum] = match;
    const ids = idStr.split(',').filter(id => id.trim() !== '');
    if (ids.length === 0) {
      setError('List cannot be empty.');
      return;
    }
    let calculatedSum = 0;
    const normalizedIds: string[] = [];
    for (const id of ids) {
      const cleanId = id.trim();
      if (!/^\d+$/.test(cleanId)) {
        setError(`Invalid ID "${cleanId}". All IDs must be numbers.`);
        return;
      }
      const normalizedId = normalizeEntryId(cleanId);
      if (!wordIdSet.has(normalizedId)) {
        setError(`Word with ID "${cleanId}" does not exist in the dictionary.`);
        return;
      }
      normalizedIds.push(normalizedId);
      calculatedSum += parseInt(cleanId, 10);
    }
    if (calculatedSum !== parseInt(checksum, 10)) {
      setError('Checksum does not match. Please verify your list.');
      return;
    }
    onImport(normalizedIds, checksum, 'Imported List', undefined, true); // No password for old format
  }

  const handleCustomImport = (code: string) => {
    try {
        const parts = code.split(':');
        if (parts.length !== 4 || parts[0] !== 'C1L') throw new Error('Invalid custom list format.');
        const [_, hasPassword, checksum, encodedPayload] = parts;
        
        const cipheredPayload = atob(encodedPayload);
        const payload = simpleCipher(cipheredPayload, CIPHER_KEY);
        const calculatedChecksum = payload.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0).toString();
        
        if (calculatedChecksum !== checksum) {
            throw new Error('Checksum mismatch. The data is corrupt.');
        }

        const listData: CustomListPayload = JSON.parse(payload);
        if (!listData.name || !Array.isArray(listData.pairs)) {
             throw new Error('Decrypted data is not a valid list.');
        }

        const foundIds = new Set<string>();
        for (const pair of listData.pairs) {
            for (const entry of dictionary) {
                if (entry.meanings.some(m => 
                    m.spanish.word.toLowerCase() === pair.spanish.toLowerCase() && 
                    m.english.word.toLowerCase() === pair.english.toLowerCase()
                )) {
                    foundIds.add(entry.id);
                    break;
                }
            }
        }
        
        const idsAsArray = Array.from(foundIds);
        if (idsAsArray.length === 0) {
            setError("No words from this custom list could be found in the dictionary.");
            return;
        }

        const idSum = idsAsArray.reduce((sum, id) => sum + parseInt(id, 10), 0);
        onImport(idsAsArray, idSum.toString(), listData.name, listData.password, listData.showVulgar);

    } catch (e: any) {
         setError(`Marking failed: ${e.message}`);
    }
  }

  const handleAttemptImport = () => {
    setError(null);
    const trimmedCode = listCode.trim();
    if (!trimmedCode) {
        setError("Input is empty.");
        return;
    }

    if (trimmedCode.startsWith('C1L:')) {
        handleCustomImport(trimmedCode);
    } else {
        handleDictionaryImport(trimmedCode);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full p-4 bg-[#191724] text-slate-200">
      <div className="w-full max-w-2xl text-center">
        <button onClick={onBack} className="absolute top-8 left-8 p-2 rounded-full hover:bg-slate-700 transition-colors">
            <BackIcon className="w-8 h-8"/>
        </button>
        <h1 className="text-4xl font-bold mb-2">Mark List</h1>
        <p className="text-slate-400 mb-8">
          Paste a list code to mark words in the dictionary. This will become your active list.
        </p>
        <textarea
          value={listCode}
          onChange={(e) => setListCode(e.target.value)}
          placeholder="e.g., C1L:true:12345:..."
          className="w-full h-40 p-4 font-mono text-lg bg-black/50 text-white placeholder-slate-400 rounded-lg border-2 border-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500"
        />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <button
          onClick={handleAttemptImport}
          className="mt-6 w-full max-w-xs bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Mark List
        </button>
      </div>
    </div>
  );
};