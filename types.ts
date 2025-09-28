// FIX: Add import for Phaser to resolve 'Cannot find namespace "Phaser"' error.
import Phaser from 'phaser';

export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  grade?: number; // for students
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  type: 'mcq' | 'fill-in-the-blanks';
  explanation: string;
}

export interface ChapterContent {
  id: string;
  type: 'lecture' | 'pdf' | 'quiz' | 'game';
  title: string;
  description?: string;
  url?: string; // for video/pdf download
  questions?: QuizQuestion[];
  gameConfig?: Phaser.Types.Core.GameConfig;
}

export interface Chapter {
  id: string;
  title: string;
  content: ChapterContent[];
}

export interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  chapters: Chapter[];
}

export interface StudentProgress {
  [subjectId: string]: {
    completionPercentage: number;
    quizScores: { [quizId: string]: number };
    completedContent: string[];
  };
}

export interface StudentData {
  id: string;
  name: string;
  grade: number;
  progress: StudentProgress;
  coins: number;
  badges: string[];
  level: 'Bronze' | 'Silver' | 'Gold';
  lastUpdated: number;
}

export interface Recommendation {
  contentId: string;
  subjectId: string;
  chapterId: string;
  title: string;
  type: 'lecture' | 'pdf' | 'quiz' | 'game';
  reason: string;
}