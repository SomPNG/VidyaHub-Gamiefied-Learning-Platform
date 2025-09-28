import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { StudentData, Subject, User } from '../types';
import { MOCK_STUDENT_DATA, MOCK_SUBJECTS } from '../constants';

// =========== IndexedDB Utilities ===========
const DB_NAME = 'vidyahub-db';
const DB_VERSION = 1;
const STORE_NAME = 'studentData';

let db: IDBDatabase;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening IndexedDB.');
    };
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function saveStudentDataToDB(data: StudentData): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Error saving data to IndexedDB:', request.error);
      reject('Could not save data to DB.');
    };
  });
}

async function getStudentDataFromDB(userId: string): Promise<StudentData | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(userId);
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    request.onerror = () => {
      console.error('Error getting data from IndexedDB:', request.error);
      reject('Could not get data from DB.');
    };
  });
}
// ===========================================

interface DataContextType {
  subjects: Subject[];
  studentData: StudentData | null;
  allStudentsData: StudentData[];
  leaderboard: StudentData[];
  completeContent: (subjectId: string, contentId: string, contentType: string, quizScore?: number) => void;
  addCoins: (amount: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [allStudentsData, setAllStudentsData] = useState<StudentData[]>([]);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [leaderboard, setLeaderboard] = useState<StudentData[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const syncOfflineData = async () => {
      if (user && user.role === 'student') {
        const dbData = await getStudentDataFromDB(user.id);
        if (dbData) {
          localStorage.setItem(`vidyahub_student_data_${user.id}`, JSON.stringify(dbData));
          console.log("Came online: Synced IndexedDB data to localStorage.");
        }
      }
    };
    if (isOnline) {
      syncOfflineData();
    }
  }, [isOnline, user]);

  const getInitialStudentData = useCallback(async (currentUser: User) => {
    let dataFromDB = await getStudentDataFromDB(currentUser.id);
    const storedDataJSON = localStorage.getItem(`vidyahub_student_data_${currentUser.id}`);
    let dataFromLS: StudentData | null = storedDataJSON ? JSON.parse(storedDataJSON) : null;

    let finalData: StudentData;
    if (dataFromDB && dataFromLS) {
      finalData = dataFromDB.lastUpdated > dataFromLS.lastUpdated ? dataFromDB : dataFromLS;
    } else if (dataFromDB) {
      finalData = dataFromDB;
    } else if (dataFromLS) {
      finalData = dataFromLS;
    } else {
      const mockUser = MOCK_STUDENT_DATA.find(u => u.name.toLowerCase() === currentUser.name.toLowerCase());
      finalData = mockUser || {
        id: currentUser.id,
        name: currentUser.name || 'Student',
        grade: currentUser.grade || 6,
        progress: {},
        coins: 0,
        badges: [],
        level: 'Bronze',
        lastUpdated: Date.now(),
      };
    }
    return finalData;
  }, []);

  useEffect(() => {
    const loadStudentData = async () => {
      if (user && user.role === 'student') {
        const data = await getInitialStudentData(user);
        setStudentData(data);
        await saveStudentDataToDB(data);
        if (isOnline) {
          localStorage.setItem(`vidyahub_student_data_${user.id}`, JSON.stringify(data));
        }
      } else if (user && user.role === 'teacher') {
        const storedAllData = localStorage.getItem('vidyahub_all_students');
        setAllStudentsData(storedAllData ? JSON.parse(storedAllData) : MOCK_STUDENT_DATA);
      }
    };
    loadStudentData();
  }, [user, isOnline, getInitialStudentData]);

  useEffect(() => {
    const allData = user?.role === 'teacher' ? allStudentsData : MOCK_STUDENT_DATA;
    const sorted = [...allData].sort((a, b) => b.coins - a.coins);
    setLeaderboard(sorted);
  }, [allStudentsData, user]);
  
  const updateStudentData = useCallback(async (newData: StudentData) => {
    const updatedDataWithTimestamp = { ...newData, lastUpdated: Date.now() };
    setStudentData(updatedDataWithTimestamp);
    await saveStudentDataToDB(updatedDataWithTimestamp);

    if (isOnline) {
      localStorage.setItem(`vidyahub_student_data_${updatedDataWithTimestamp.id}`, JSON.stringify(updatedDataWithTimestamp));
    }
    
    setAllStudentsData(prev => {
      const index = prev.findIndex(s => s.id === updatedDataWithTimestamp.id);
      const newAllData = [...prev];
      if (index > -1) {
        newAllData[index] = updatedDataWithTimestamp;
      } else {
        newAllData.push(updatedDataWithTimestamp);
      }
      if (isOnline) {
          localStorage.setItem('vidyahub_all_students', JSON.stringify(newAllData));
      }
      return newAllData;
    });
  }, [isOnline]);

  const completeContent = useCallback((subjectId: string, contentId: string, contentType: string, quizScore?: number) => {
    if (!studentData) return;
    
    const currentProgress = studentData.progress[subjectId] || { completedContent: [], quizScores: {}, completionPercentage: 0 };
    if(currentProgress.completedContent.includes(contentId)) return;

    const coinsEarned = contentType === 'quiz' ? 50 + (quizScore || 0) : (contentType === 'lecture' ? 20 : 15);
    const newCompletedContent = [...currentProgress.completedContent, contentId];
    const subject = subjects.find(s => s.id === subjectId);
    const totalContentCount = subject?.chapters.reduce((acc, chapter) => acc + chapter.content.length, 0) || 1;
    const completionPercentage = Math.min(100, Math.round((newCompletedContent.length / totalContentCount) * 100));

    const newProgress = {
      ...currentProgress,
      completedContent: newCompletedContent,
      quizScores: quizScore !== undefined ? { ...currentProgress.quizScores, [contentId]: quizScore } : currentProgress.quizScores,
      completionPercentage: completionPercentage,
    };

    const updatedData: StudentData = {
      ...studentData,
      coins: studentData.coins + coinsEarned,
      progress: {
        ...studentData.progress,
        [subjectId]: newProgress
      }
    };
    updateStudentData(updatedData);
  }, [studentData, updateStudentData, subjects]);

  const addCoins = useCallback((amount: number) => {
    if(!studentData) return;
    const updatedData = { ...studentData, coins: studentData.coins + amount };
    updateStudentData(updatedData);
  }, [studentData, updateStudentData]);

  return (
    <DataContext.Provider value={{ subjects, studentData, allStudentsData, leaderboard, completeContent, addCoins }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};