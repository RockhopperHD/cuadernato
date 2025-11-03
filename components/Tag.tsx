import React, { useState } from 'react';

interface TagProps {
  type: 'VULGAR' | 'REFLEXIVE' | 'LATAM' | 'SPAIN' | 'GENDER-SPECIFIC' | 'COLLOQUIAL' | string;
}

const tagStyles: { [key: string]: { bg: string, text: string, tooltip: string } } = {
  VULGAR: { bg: 'bg-red-500', text: 'text-white', tooltip: 'This word is considered vulgar or offensive.' },
  REFLEXIVE: { bg: 'bg-green-500', text: 'text-white', tooltip: 'This is a reflexive verb, where the action reflects back on the subject.' },
  LATAM: { bg: 'bg-sky-500', text: 'text-white', tooltip: 'This usage is common in Latin America.' },
  SPAIN: { bg: 'bg-amber-500', text: 'text-white', tooltip: 'This usage is common in Spain.' },
  'GENDER-SPECIFIC': { bg: 'bg-purple-500', text: 'text-white', tooltip: "Changing this word's gender (e.g. -o to -a) significantly changes its meaning." },
  COLLOQUIAL: { bg: 'bg-cyan-500', text: 'text-white', tooltip: 'This is a colloquial or informal term.' },
};

export const Tag: React.FC<TagProps> = ({ type }) => {
  const style = tagStyles[type] || { bg: 'bg-gray-500', text: 'text-white', tooltip: `Tag: ${type}` };
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
        {type}
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