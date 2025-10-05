import React, { useState } from 'react';
import { generateStudyAids } from './services/geminiService';
import type { StudyAids, QuizResult, ActiveTab } from './types';
import TextInputArea from './components/TextInputArea';
import StudyAidsTabs from './components/StudyAidsTabs';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [studyAids, setStudyAids] = useState<StudyAids | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');

  const handleGenerate = async (text: string) => {
    if (!text.trim()) {
      setError('Please enter some text or upload a document to generate study aids.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setStudyAids(null);

    try {
      const result = await generateStudyAids(text);
      setStudyAids(result);
      setActiveTab('summary');
    } catch (e) {
      console.error(e);
      setError('Failed to generate study aids. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizHistory(prevHistory => [...prevHistory, result]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-500 to-teal-400 text-transparent bg-clip-text">AI-br</h1>
                    <p className="text-slate-500">Your AI-powered study assistant.</p>
                </div>
            </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <TextInputArea onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          
          <div className="lg:row-start-1 lg:col-start-2">
            <StudyAidsTabs 
              studyAids={studyAids} 
              isLoading={isLoading} 
              error={error}
              onQuizComplete={handleQuizComplete}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
