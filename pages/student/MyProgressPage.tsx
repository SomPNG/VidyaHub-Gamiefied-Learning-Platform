
import React from 'react';
import { useData } from '../../context/DataContext';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import { BADGES } from '../../constants';
import { BookOpenIcon, StarIcon, TrophyIcon } from '@heroicons/react/24/solid';

const MyProgressPage: React.FC = () => {
  const { studentData, subjects } = useData();

  if (!studentData) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">My Progress</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><BookOpenIcon className="w-6 h-6 mr-2 text-teal-500"/>Subject Mastery</h2>
            {subjects.map(subject => {
              const progress = studentData.progress[subject.id];
              const percentage = progress?.completionPercentage || 0;
              return (
                <div key={subject.id} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{subject.name}</span>
                    <span className="text-sm font-medium text-teal-500">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                    <div
                      className="bg-teal-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><StarIcon className="w-6 h-6 mr-2 text-yellow-500"/>Quiz Performance</h2>
             {Object.keys(studentData.progress).length === 0 && <p className="text-slate-500">No quizzes taken yet.</p>}
             {Object.entries(studentData.progress).map(([subjectId, progressData]) => (
                 Object.entries(progressData.quizScores).map(([quizId, score]) => (
                    <div key={quizId} className="flex justify-between items-center p-3 border-b dark:border-slate-700">
                        <span>{subjects.find(s=>s.id===subjectId)?.chapters.flatMap(c=>c.content).find(c=>c.id === quizId)?.title}</span>
                        <span className="font-bold text-green-500">{score} pts</span>
                    </div>
                 ))
             ))}
          </Card>
        </div>

        <div className="space-y-6">
            <Card className="p-6 text-center">
                <span className="text-5xl">🪙</span>
                <p className="text-4xl font-bold mt-2">{studentData.coins}</p>
                <p className="text-slate-500">Total Coins</p>
            </Card>
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center"><TrophyIcon className="w-6 h-6 mr-2 text-yellow-500"/>Badges Earned</h2>
                <div className="flex flex-wrap gap-4 justify-center">
                    {studentData.badges.length > 0 ? studentData.badges.map(badgeKey => {
                        const badge = BADGES[badgeKey as keyof typeof BADGES];
                        return badge ? (
                            <div key={badgeKey} className="text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-700" title={badge.description}>
                                <span className="text-4xl">{badge.icon}</span>
                                <p className="text-sm font-semibold mt-1">{badge.name}</p>
                            </div>
                        ) : null;
                    }) : <p className="text-slate-500">No badges yet. Keep learning!</p>}
                </div>
            </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MyProgressPage;