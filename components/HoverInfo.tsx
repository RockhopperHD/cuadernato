import React, { useState } from 'react';

interface HoverInfoProps {
  label: string;
  tooltip: string;
}

export const HoverInfo: React.FC<HoverInfoProps> = ({ label, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <span
      className="inline-flex border-b border-dotted border-slate-500/70 dark:border-slate-300/60 pb-0.5 text-slate-700 dark:text-slate-200 cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
    >
      <span className="font-semibold">{label}</span>
      {showTooltip && (
        <div
          className="fixed max-w-xs p-2 text-sm bg-white text-slate-900 rounded-md z-50 border border-slate-200 shadow-lg pointer-events-none dark:bg-slate-900 dark:text-white dark:border-slate-700"
          style={{ top: position.y, left: position.x, transform: 'translate(10px, -100%)' }}
        >
          {tooltip}
        </div>
      )}
    </span>
  );
};
