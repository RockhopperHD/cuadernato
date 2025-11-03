import React, { useState, useEffect } from 'react';

const TIPS = {
  ES: [
    '¿Sabías que puedes marcar palabras como favoritas con la estrella?',
    'Usa los botones de conjugación para explorar diferentes tiempos y modos verbales.',
    'Las etiquetas de colores te dan más contexto sobre el uso de una palabra.',
    'Busca cualquier palabra para empezar a explorar el diccionario.',
  ],
  EN: [
    'Did you know you can star words as favorites using the star icon?',
    'Use the conjugation buttons to explore different verb tenses and moods.',
    'Colored tags give you more context about a word\'s usage.',
    'Search for any word to begin exploring the dictionary.',
  ],
};

interface RotatingTipsProps {
  lang: 'ES' | 'EN';
}

export const RotatingTips: React.FC<RotatingTipsProps> = ({ lang }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const tips = TIPS[lang];

  useEffect(() => {
    setVisible(true); // Show tip immediately when language changes
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        setVisible(true);
      }, 500); // fade out duration
    }, 5000); // 5 seconds per tip

    return () => clearInterval(interval);
  }, [tips, lang]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div 
        className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className="text-lg text-slate-500 dark:text-slate-400">{tips[tipIndex]}</p>
      </div>
    </div>
  );
};
