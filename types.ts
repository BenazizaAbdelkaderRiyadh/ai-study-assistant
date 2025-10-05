// FIX: Removed self-imports for `Flashcard` and `QuizQuestion` which were causing declaration conflicts.

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface StudyAids {
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  nextSteps: string[];
}

export interface QuizResult {
  score: number;
  total: number;
  attempt: number;
}

export type ActiveTab = 'summary' | 'flashcards' | 'quiz';
