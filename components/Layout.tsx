import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ArrowLeftOnRectangleIcon, UserCircleIcon, AcademicCapIcon, HomeIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { studentData } = useData();
    const navigate = useNavigate();

    const homeLink = user?.role === 'student' ? '/student/dashboard' : '/teacher/dashboard';

    return (
        <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
            <Link to={homeLink} className="text-2xl font-bold text-teal-600 dark:text-teal-400 flex items-center">
                <AcademicCapIcon className="w-8 h-8 mr-2"/>
                VidyaHub
            </Link>
            <div className="flex items-center gap-4">
                {user?.role === 'student' && studentData && (
                    <div className="font-bold text-lg text-yellow-500 flex items-center bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 rounded-full">
                        {studentData.coins} <span className="ml-1">🪙</span>
                    </div>
                )}
                <span className="font-semibold hidden sm:inline">{user?.name}</span>
                <UserCircleIcon className="w-8 h-8 text-slate-500" />
                <button onClick={() => { logout(); navigate('/'); }} aria-label="Logout" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                    <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

const AITutorFAB: React.FC = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/ai-tutor')}
            className="fixed bottom-20 md:bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition transform hover:scale-110 z-50 animate-pulse"
            aria-label="AI Tutor Assistant"
        >
            <SparklesIcon className="w-8 h-8" />
        </button>
    );
};

const StudentNav: React.FC = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around p-2 md:hidden z-40">
        <Link to="/student/dashboard" className="flex flex-col items-center text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 p-1">
            <HomeIcon className="w-6 h-6"/>
            <span className="text-xs">Home</span>
        </Link>
        <Link to="/student/progress" className="flex flex-col items-center text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 p-1">
            <ChartBarIcon className="w-6 h-6"/>
            <span className="text-xs">Progress</span>
        </Link>
    </nav>
)

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useAuth();
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
            <Header />
            <main className="p-4 md:p-8 pb-20 md:pb-8">
                {children}
            </main>
            {user?.role === 'student' && <AITutorFAB />}
            {user?.role === 'student' && <StudentNav />}
        </div>
    );
};

export default Layout;