import React, { useState, useEffect } from 'react';
import type { Flashcard } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, HelpCircleIcon, SparklesIcon } from './Icons';

interface FlashcardViewProps {
  flashcards: Flashcard[];
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);
  
  if (flashcards.length === 0) {
    return <div className="text-center text-slate-500">No flashcards were generated.</div>;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0));
  };
  
  const card = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-between h-full">
      <h2 className="text-2xl font-bold text-slate-800">Flashcards</h2>
      
      <div className="w-full max-w-lg h-80 perspective-1000 my-4">
        <div
          className={`relative w-full h-full cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
          aria-live="polite"
        >
          {/* Card Front */}
          <div className="absolute w-full h-full bg-white rounded-xl flex flex-col justify-between p-6 text-center shadow-lg [backface-visibility:hidden] border border-slate-200">
            <div className="flex items-center gap-2 text-cyan-600">
                <HelpCircleIcon className="w-5 h-5" />
                <span className="font-semibold text-sm">Question</span>
            </div>
            <p className="text-2xl text-slate-800 font-medium flex-grow flex items-center justify-center">{card.question}</p>
            <div className="h-8"></div>
          </div>
          
          {/* Card Back */}
          <div className="absolute w-full h-full bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex flex-col justify-between p-6 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
             <div className="flex items-center gap-2 text-white/80">
                <SparklesIcon className="w-5 h-5" />
                <span className="font-semibold text-sm">Answer</span>
            </div>
            <p className="text-xl text-white font-medium flex-grow flex items-center justify-center">{card.answer}</p>
            <div className="h-8"></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between w-full max-w-md">
        <button onClick={goToPrevious} className="p-3 bg-white border border-slate-200 shadow-sm rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeftIcon className="w-6 h-6 text-slate-700" />
        </button>
        <span className="text-slate-600 font-medium">
          {currentIndex + 1} / {flashcards.length}
        </span>
        <button onClick={goToNext} className="p-3 bg-white border border-slate-200 shadow-sm rounded-full hover:bg-slate-100 transition-colors">
          <ChevronRightIcon className="w-6 h-6 text-slate-700" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;