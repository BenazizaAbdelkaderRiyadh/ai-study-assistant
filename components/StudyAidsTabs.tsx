import React from 'react';
import type { StudyAids, QuizResult, ActiveTab } from '../types';
import SummaryView from './SummaryView';
import FlashcardView from './FlashcardView';
import QuizView from './QuizView';
import Loader from './Loader';
import { BookOpenIcon, LayersIcon, CheckSquareIcon, AlertTriangleIcon } from './Icons';

interface StudyAidsTabsProps {
  studyAids: StudyAids | null;
  isLoading: boolean;
  error: string | null;
  onQuizComplete: (result: QuizResult) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const tabConfig = [
  { id: 'summary', label: 'Summary', icon: BookOpenIcon },
  { id: 'flashcards', label: 'Flashcards', icon: LayersIcon },
  { id: 'quiz', label: 'Quiz', icon: CheckSquareIcon },
];

const StudyAidsTabs: React.FC<StudyAidsTabsProps> = ({ studyAids, isLoading, error, onQuizComplete, activeTab, setActiveTab }) => {
  const renderContent = () => {
    if (isLoading) {
      return <Loader message="Generating your study materials..." />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-full">
            <AlertTriangleIcon className="w-16 h-16 text-red-500 mb-4"/>
            <h3 className="text-xl font-semibold text-slate-800">An Error Occurred</h3>
            <p className="text-red-500 mt-2">{error}</p>
        </div>
      );
    }
    if (!studyAids) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-full">
            <div className="p-5 rounded-full bg-gradient-to-br from-cyan-100 to-slate-200 mb-4">
              <BookOpenIcon className="w-16 h-16 text-cyan-600"/>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Ready to Learn?</h3>
            <p className="text-slate-500 mt-2">Generate your study aids to get started.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'summary':
        return <SummaryView summary={studyAids.summary} nextSteps={studyAids.nextSteps} />;
      case 'flashcards':
        return <FlashcardView flashcards={studyAids.flashcards} />;
      case 'quiz':
        return <QuizView quiz={studyAids.quiz} onComplete={onQuizComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col min-h-[500px] lg:h-full border border-slate-200">
      <div className="border-b border-slate-200">
        <nav className="flex" aria-label="Tabs">
          {tabConfig.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`
                flex items-center gap-2 font-medium text-sm py-4 px-6 transition-colors duration-200
                ${activeTab === tab.id 
                  ? 'border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}
                ${index === 0 ? 'rounded-tl-lg' : ''}
              `}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6 flex-grow relative">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudyAidsTabs;