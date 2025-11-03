
import React, { useState } from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'gray';
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children, variant }) => {
  const variantClasses = {
    green: 'bg-green-600 dark:bg-green-700',
    blue: 'bg-blue-600 dark:bg-blue-700',
    gray: 'bg-slate-500 dark:bg-slate-600',
  }

  const headerClasses = `flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 ${variant ? `${variantClasses[variant]} text-white` : ''}`;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className={headerClasses}>
          <h2 id="modal-title" className={`text-lg font-semibold ${variant ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{title}</h2>
          <button 
            onClick={onClose} 
            className={variant ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};