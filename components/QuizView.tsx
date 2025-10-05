import React, { useState, useMemo, useEffect } from 'react';
import type { QuizQuestion, QuizResult } from '../types';
import { RefreshCwIcon, TargetIcon } from './Icons';

interface QuizViewProps {
  quiz: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
}


const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const QuizView: React.FC<QuizViewProps> = ({ quiz, onComplete }) => {
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [key, setKey] = useState(0); 

  useEffect(() => {
    if (quiz.length === 0) return;
    

    const shuffledQuestions = shuffleArray(quiz);

    const fullyShuffledQuiz = shuffledQuestions.map((question: QuizQuestion) => ({
      ...question,
      options: shuffleArray(question.options),
    }));
    
    setActiveQuiz(fullyShuffledQuiz);

    setCurrentQuestionIndex(0);
    setUserAnswers(Array(quiz.length).fill(null));
    setIsFinished(false);
  }, [quiz, key]); 

  const score = useMemo(() => {
    if (!isFinished || activeQuiz.length === 0) return 0;
    return userAnswers.reduce((total, answer, index) => {
      return answer === activeQuiz[index].correctAnswer ? total + 1 : total;
    }, 0);
  }, [isFinished, userAnswers, activeQuiz]);

  const handleAnswerSelect = (answer: string) => {
    if (isFinished) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const goToNext = () => {
    if (currentQuestionIndex < activeQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsFinished(true);
    onComplete({ score, total: activeQuiz.length, attempt: Date.now() });
  };
  
  const handleRestart = () => {
    setKey(prev => prev + 1); 
  };

  if (activeQuiz.length === 0) {
    return <div className="text-center text-slate-500">No quiz questions were generated.</div>;
  }

  const currentQuestion = activeQuiz[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];

  if (isFinished) {
    const percentage = Math.round((score / activeQuiz.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <TargetIcon className="w-16 h-16 text-cyan-500 mb-4" />
        <h2 className="text-3xl font-bold text-slate-800">Quiz Complete!</h2>
        <p className="text-slate-600 mt-2">
          You scored {score} out of {activeQuiz.length}.
        </p>
        <div className="text-6xl font-bold text-cyan-600 my-4">{percentage}%</div>
        <button onClick={handleRestart} className="mt-8 flex items-center gap-2 bg-cyan-600 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-500 transition-colors shadow hover:shadow-md">
          <RefreshCwIcon className="w-5 h-5"/>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Time</h2>
      <p className="text-slate-500 mb-6">Question {currentQuestionIndex + 1} of {activeQuiz.length}</p>
      
      <div className="flex-grow">
        <p className="text-lg font-medium text-slate-800 mb-6">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = userAnswer === option;
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                  ${isSelected ? 'bg-cyan-50 border-cyan-500 ring-2 ring-cyan-500' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                `}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-200">
        <button onClick={goToPrevious} disabled={currentQuestionIndex === 0} className="py-2 px-4 rounded-md font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Previous
        </button>
        {currentQuestionIndex === activeQuiz.length - 1 ? (
          <button onClick={handleSubmit} disabled={userAnswers.includes(null)} className="py-2 px-6 rounded-md bg-cyan-600 text-white font-semibold hover:bg-cyan-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors">
            Submit
          </button>
        ) : (
          <button onClick={goToNext} disabled={!userAnswer} className="py-2 px-4 rounded-md font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;