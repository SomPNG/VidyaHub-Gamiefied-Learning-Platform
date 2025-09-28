
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import SubjectPage from './pages/student/SubjectPage';
import MyProgressPage from './pages/student/MyProgressPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import UploadContentPage from './pages/teacher/UploadContentPage';
import CreateQuizPage from './pages/teacher/CreateQuizPage';
import AITutorPage from './pages/AITutorPage';

// A protected route component to guard routes based on authentication and role
const ProtectedRoute: React.FC<{ children: React.ReactElement; role: 'student' | 'teacher' }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!user ? <LandingPage /> : (user.role === 'student' ? <Navigate to="/student/dashboard" /> : <Navigate to="/teacher/dashboard" />)} />
      <Route path="/login/:role" element={<LoginPage />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/subject/:subjectId" element={<ProtectedRoute role="student"><SubjectPage /></ProtectedRoute>} />
      <Route path="/student/progress" element={<ProtectedRoute role="student"><MyProgressPage /></ProtectedRoute>} />
      
      {/* Teacher Routes */}
      <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/upload" element={<ProtectedRoute role="teacher"><UploadContentPage /></ProtectedRoute>} />
      <Route path="/teacher/create-quiz" element={<ProtectedRoute role="teacher"><CreateQuizPage /></ProtectedRoute>} />

      {/* Common Routes */}
      <Route path="/ai-tutor" element={user ? <AITutorPage /> : <Navigate to="/" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <div className="min-h-screen text-slate-800 dark:text-slate-200">
            <AppRoutes />
          </div>
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
}