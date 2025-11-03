
import React from 'react';
import { AppMode } from '../types';

interface TitleScreenProps {
  setMode: (mode: AppMode) => void;
  isListLocked: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ setMode, isListLocked }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="text-center">
        {/* Update: Replaced AppLogoIcon with a placeholder image */}
        <div className="flex flex-col items-center justify-center mb-4">
            <img src="https://via.placeholder.com/200" alt="Cuadernato Logo" className="w-32 h-32 rounded-lg" />
            <h1 className="text-7xl font-bold text-slate-800 dark:text-slate-100 mt-4">
                Cuadernato
            </h1>
        </div>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12">
          Your personal Spanish-English dictionary.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setMode('dictionary')}
            className="w-64 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Dictionary
          </button>
           <button
            onClick={() => setMode('importList')}
            disabled={isListLocked}
            title={isListLocked ? "A locked list is active. Unlock it before importing a new one." : "Import a new word list"}
            className="w-64 bg-slate-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-slate-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:bg-slate-400 dark:disabled:bg-slate-800 disabled:cursor-not-allowed disabled:transform-none"
          >
            Import List
          </button>
          <button
            disabled
            className="w-64 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold py-3 px-6 rounded-lg text-lg cursor-not-allowed"
          >
            Flashcards (Coming Soon)
          </button>
        </div>
      </div>
       <footer className="absolute bottom-0 text-center py-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © 2024 Cuadernato. All Rights Reserved. A sample application for demonstration purposes.
        </p>
      </footer>
    </div>
  );
};
