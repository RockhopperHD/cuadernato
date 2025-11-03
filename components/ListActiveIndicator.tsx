
import React from 'react';
import { VerticalTriangleIcon } from './icons';

interface ListActiveIndicatorProps {
  isActive: boolean;
  isLocked: boolean;
  checksum: string | null;
  onClick: () => void;
}

export const ListActiveIndicator: React.FC<ListActiveIndicatorProps> = ({ isActive, isLocked, checksum, onClick }) => {
  let indicatorColor = 'text-slate-500';
  let topText = 'LIST INACTIVE';
  let bottomText = '=0000000';

  if (isActive) {
    indicatorColor = isLocked ? 'text-blue-500' : 'text-green-500';
    topText = isLocked ? 'LIST LOCKED' : 'LIST ACTIVE';
    bottomText = `=${checksum}`;
  }

  return (
    <button onClick={onClick} className="relative w-20 h-20" aria-label="Open List Status">
      <svg viewBox="0 0 100 100" className="absolute inset-0">
        <defs>
          <path id="circlePathTop" d={`M 10,50 a 40,40 0 1,1 80,0`} />
          <path id="circlePathBottom" d={`M 10,50 a 40,40 0 1,0 80,0`} />
        </defs>
        
        <g className={`text-sm font-mono tracking-widest fill-current ${indicatorColor}`}>
            <text>
                <textPath href="#circlePathTop" startOffset="50%" textAnchor="middle">
                    {topText}
                </textPath>
            </text>
            <text>
                 <textPath href="#circlePathBottom" startOffset="50%" textAnchor="middle">
                    {bottomText}
                </textPath>
            </text>
        </g>
      </svg>
      
      <div className="absolute inset-0 flex items-start justify-center pt-2">
        <VerticalTriangleIcon filled={false} className={`w-12 h-12 ${indicatorColor}`} style={{strokeWidth: 1.5}}/>
      </div>
    </button>
  );
};