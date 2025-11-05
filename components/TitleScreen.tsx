
import React from 'react';
import { AppMode } from '../types';

interface TitleScreenProps {
  setMode: (mode: AppMode) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ setMode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full text-center">
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
        <div className="flex flex-col items-center gap-4 w-80">
          <button
            onClick={() => setMode('dictionary')}
            className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg text-xl hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Dictionary
          </button>
           <div className="flex w-full gap-2 mt-2">
              <button
                onClick={() => setMode('listBuilder')}
                className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-md hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                List Builder
              </button>
              <button
                onClick={() => setMode('viewWords')}
                className="flex-1 bg-slate-600 text-white font-bold py-3 px-4 rounded-lg text-md hover:bg-slate-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300"
              >
                View Words
              </button>
          </div>
        </div>
       <footer className="absolute bottom-4 left-0 right-0 text-center py-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © 2024 Cuadernato. All Rights Reserved. A sample application for demonstration purposes.
        </p>
      </footer>
    </div>
  );
};