
import React from 'react';
import { VerticalTriangleIcon } from './icons';

interface ListActiveIndicatorProps {
  isActive: boolean;
  isLocked: boolean;
  checksum: string | null;
}

export const ListActiveIndicator: React.FC<ListActiveIndicatorProps> = ({ isActive, isLocked, checksum }) => {
  if (!isActive) {
    return <div className="w-20 h-20" />; // Render an empty space when inactive
  }
  
  const indicatorColor = isLocked ? 'text-red-500' : 'text-green-500';

  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 100 100" className="absolute inset-0">
        <defs>
          <path id="circlePathTop" d={`M 10,50 a 40,40 0 1,1 80,0`} />
          <path id="circlePathBottom" d={`M 10,50 a 40,40 0 1,0 80,0`} />
        </defs>
        
        <g className={`text-sm font-mono tracking-widest fill-current ${indicatorColor}`}>
            <text>
                <textPath href="#circlePathTop" startOffset="50%" textAnchor="middle">
                    {isLocked ? 'LIST LOCKED' : 'LIST ACTIVE'}
                </textPath>
            </text>
            <text>
                 <textPath href="#circlePathBottom" startOffset="50%" textAnchor="middle">
                    {`=${checksum}`}
                </textPath>
            </text>
        </g>
      </svg>
      
      <div className="absolute inset-0 flex items-start justify-center pt-2">
        <VerticalTriangleIcon filled={false} className={`w-12 h-12 ${indicatorColor}`} style={{strokeWidth: 1.5}}/>
      </div>
    </div>
  );
};
