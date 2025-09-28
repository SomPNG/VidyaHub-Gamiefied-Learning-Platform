
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Leaderboard from '../../components/Leaderboard';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import RecommendationEngine from '../../components/RecommendationEngine';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { studentData, subjects, leaderboard } = useData();

  if (!studentData) {
    return <Layout><div>Loading student data...</div></Layout>;
  }

  const { name, coins, level, badges } = studentData;

  const getLevelColor = (level: string) => {
    if (level === 'Gold') return 'text-amber-400 bg-amber-100 dark:bg-amber-900/50';
    if (level === 'Silver') return 'text-slate-400 bg-slate-200 dark:bg-slate-700';
    return 'text-orange-500 bg-orange-100 dark:bg-orange-900/50';
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {name}!</h1>
          <p className="text-slate-500 mt-1">Ready to continue your learning adventure?</p>
        </div>

        <RecommendationEngine />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <span className="text-5xl">🪙</span>
            <p className="text-3xl font-bold mt-2">{coins}</p>
            <p className="text-slate-500">Coins Earned</p>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-bold px-4 py-2 rounded-lg ${getLevelColor(level)}`}>{level}</span>
            <p className="text-3xl font-bold mt-2">{level}</p>
            <p className="text-slate-500">Current Level</p>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <div className="flex text-3xl">
                {badges.length > 0 ? badges.slice(0,3).map(b => <span key={b}>🏆</span>) : <span className="text-slate-400">🏅</span>}
            </div>
            <p className="text-3xl font-bold mt-2">{badges.length}</p>
            <p className="text-slate-500">Badges Unlocked</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <BookOpenIcon className="w-6 h-6 mr-2 text-teal-500"/>
                Your Subjects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {subjects.map(subject => (
                <Link to={`/student/subject/${subject.id}`} key={subject.id}>
                  <Card className="p-6 text-center" onClick={() => {}}>
                    <subject.icon className="w-16 h-16 mx-auto text-teal-500" />
                    <h3 className="text-xl font-semibold mt-4">{subject.name}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <Leaderboard students={leaderboard} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;