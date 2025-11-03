
import React from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  lang: 'ES' | 'EN';
  toggleLang: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, lang, toggleLang }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={lang === 'ES' ? 'Busca una palabra...' : 'Search for a word...'}
        className="w-full bg-blue-600 text-white placeholder-blue-200 text-2xl font-bold p-5 pl-6 pr-24 rounded-t-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
        autoComplete="off"
      />
      <button
        onClick={toggleLang}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-800 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {lang}
      </button>
    </div>
  );
};
