
import React, { useState } from 'react';
import { BackIcon } from './icons';

interface ImportListScreenProps {
  onImport: (list: string[], checksum: string, password?: string) => void;
  onBack: () => void;
  wordIds: Set<string>;
}

export const ImportListScreen: React.FC<ImportListScreenProps> = ({ onImport, onBack, wordIds }) => {
  const [listCode, setListCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    setError(null);
    const trimmedCode = listCode.trim();

    // Regex to capture IDs, checksum, and optional password in {braces}
    const importRegex = /^(.*)=(\d+)(?:\{(.*)\})?$/;
    const match = trimmedCode.match(importRegex);

    if (!match) {
      setError('Invalid format. Must be "1,2=3" or "1,2=3{password}".');
      return;
    }

    const [, idStr, checksum, password] = match;
    
    const ids = idStr.split(',').filter(id => id.trim() !== '');
    if (ids.length === 0) {
      setError('List cannot be empty.');
      return;
    }

    let calculatedSum = 0;
    const paddedIds: string[] = [];

    for (const id of ids) {
      const cleanId = id.trim();
      if (!/^\d+$/.test(cleanId)) {
        setError(`Invalid ID "${cleanId}". All IDs must be numbers.`);
        return;
      }
      
      const paddedId = cleanId.padStart(6, '0');
      if (!wordIds.has(paddedId)) {
        setError(`Word with ID "${cleanId}" does not exist in the dictionary.`);
        return;
      }
      paddedIds.push(paddedId);
      calculatedSum += parseInt(cleanId, 10);
    }
    
    if (calculatedSum !== parseInt(checksum, 10)) {
      setError('Checksum does not match. Please verify your list.');
      return;
    }
    
    onImport(paddedIds, checksum, password);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full p-4">
      <div className="w-full max-w-2xl text-center">
        <button onClick={onBack} className="absolute top-8 left-8 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <BackIcon className="w-8 h-8"/>
        </button>
        <h1 className="text-4xl font-bold mb-2">Import Word List</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Format: `1,2=3` or `1,2=3{'{password}'}`
        </p>
        <textarea
          value={listCode}
          onChange={(e) => setListCode(e.target.value)}
          placeholder="1,2,4=7{MyPassword}"
          className="w-full h-40 p-4 font-mono text-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500/50"
        />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <button
          onClick={handleImport}
          className="mt-6 w-full max-w-xs bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Import List
        </button>
      </div>
    </div>
  );
};
