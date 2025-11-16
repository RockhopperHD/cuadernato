import React, { useState } from 'react';

interface TagProps {
  type: string;
}

const TAG_STYLES: Record<string, { label: string; bg: string; text: string; tooltip: string }> = {
  VULGAR: { label: 'VULGAR', bg: 'bg-red-500', text: 'text-white', tooltip: 'This word is considered vulgar or offensive.' },
  REFL: { label: 'REFL', bg: 'bg-green-500', text: 'text-white', tooltip: 'This verb is reflexive, so the action reflects back on the subject.' },
  LATAM: { label: 'LATAM', bg: 'bg-sky-500', text: 'text-white', tooltip: 'This usage is specific to or most common in Latin America.' },
  SPAIN: { label: 'SPAIN', bg: 'bg-amber-500', text: 'text-white', tooltip: 'This usage is specific to or most common in Spain.' },
  GS: {
    label: 'GENDER-SPECIFIC',
    bg: 'bg-purple-600',
    text: 'text-white',
    tooltip: 'Changing this word’s gender (for example, -o to -a) changes the meaning.',
  },
  COLLOQUIAL: { label: 'COLLOQUIAL', bg: 'bg-cyan-500', text: 'text-white', tooltip: 'This is a colloquial or informal term.' },
  IMPERSONAL: { label: 'IMPERSONAL', bg: 'bg-indigo-500', text: 'text-white', tooltip: 'This verb is only used impersonally (for example, “hay”).' },
  article_m_override: {
    label: 'ARTICLE CHANGE',
    bg: 'bg-rose-500',
    text: 'text-white',
    tooltip:
      'This feminine noun takes the masculine singular article “el”. You still use feminine adjectives, e.g., “el agua clara”.',
  },
  plural_only: {
    label: 'PLURAL ONLY',
    bg: 'bg-teal-600',
    text: 'text-white',
    tooltip: 'This word does not have a singular form.',
  },
  singular_only: {
    label: 'SINGULAR ONLY',
    bg: 'bg-teal-800',
    text: 'text-white',
    tooltip: 'This word never appears in the plural.',
  },
  unisex: {
    label: 'UNISEX',
    bg: 'bg-pink-500',
    text: 'text-white',
    tooltip:
      'This word refers to a person and does not change form for gender. For example, “el artista” and “la artista”.',
  },
  indeclinable: {
    label: 'INDECLINABLE',
    bg: 'bg-slate-600',
    text: 'text-white',
    tooltip: 'This word does not inflect for number or gender.',
  },
};

export const Tag: React.FC<TagProps> = ({ type }) => {
  const style = TAG_STYLES[type] || { label: type, bg: 'bg-gray-500', text: 'text-white', tooltip: `Tag: ${type}` };
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
        className="inline-block" 
        onMouseEnter={() => setShowTooltip(true)} 
        onMouseLeave={() => setShowTooltip(false)}
        onMouseMove={handleMouseMove}
    >
      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
      {showTooltip && (
        <div 
          className="fixed max-w-xs p-2 text-sm bg-white text-slate-900 rounded-md z-50 border border-slate-200 shadow-lg pointer-events-none dark:bg-slate-900 dark:text-white dark:border-slate-700"
          style={{ top: position.y, left: position.x, transform: 'translate(10px, -100%)' }}
        >
          {style.tooltip}
        </div>
      )}
    </div>
  );
};