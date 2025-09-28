
import React from 'react';
import { StudentData } from '../types';
import Card from './ui/Card';
import { useAuth } from '../context/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';

interface LeaderboardProps {
  students: StudentData[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ students }) => {
  const { user } = useAuth();
  
  const getRankColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-400';
    if (rank === 1) return 'text-slate-400';
    if (rank === 2) return 'text-yellow-600';
    return 'text-slate-500';
  };

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-4 flex items-center">
        <StarIcon className="w-6 h-6 mr-2 text-yellow-500" />
        Leaderboard
      </h3>
      <ul className="space-y-3">
        {students.map((student, index) => (
          <li
            key={student.id}
            className={`flex items-center justify-between p-3 rounded-lg ${user?.name === student.name ? 'bg-teal-100 dark:bg-teal-900/50' : ''}`}
          >
            <div className="flex items-center">
              <span className={`font-bold text-lg w-8 ${getRankColor(index)}`}>{index + 1}</span>
              <span className="ml-4 font-semibold">{student.name}</span>
            </div>
            <div className="font-bold text-teal-500 flex items-center">
              {student.coins}
              <span className="text-yellow-500 ml-1">🪙</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Leaderboard;