import React, { useEffect, useRef, useState } from 'react';

const ACCENT_CHARACTERS = ['á', 'é', 'í', 'ó', 'ú', 'ï', 'ü', '€', '¡', '¿', 'ç', 'º'];

export const AccentPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedChar, setCopiedChar] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (copiedChar) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setCopiedChar(null);
      }, 1600);
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [copiedChar]);

  const handleCopy = async (character: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(character);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = character;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedChar(character);
    } catch (error) {
      console.error('Failed to copy accent character', error);
      setCopiedChar(null);
    }
  };

  return (
    <div ref={containerRef} className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-12 h-12 rounded-full bg-yellow-400 text-slate-900 shadow-lg flex items-center justify-center font-bold text-xl hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-200 dark:focus:ring-yellow-500"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Open accent palette"
        >
          Á
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 border border-yellow-200 dark:border-yellow-500/40 rounded-xl shadow-2xl p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
              Click a character to copy it.
            </p>
            <div className="grid grid-cols-6 gap-2">
              {ACCENT_CHARACTERS.map((character) => (
                <button
                  key={character}
                  type="button"
                  onClick={() => handleCopy(character)}
                  className="py-2 text-lg font-semibold rounded-lg bg-yellow-50 text-slate-800 border border-yellow-200 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {character}
                </button>
              ))}
            </div>
            {copiedChar && (
              <p className="mt-3 text-xs text-green-600 dark:text-green-400 font-medium" role="status">
                Copied “{copiedChar}” to clipboard.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
