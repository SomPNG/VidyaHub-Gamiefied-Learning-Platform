
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressChart from '../../components/ProgressChart';
import { StudentData } from '../../types';
import { PlusCircleIcon, DocumentPlusIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { allStudentsData } = useData();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-slate-500 mt-1">Here's an overview of your class's progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button onClick={() => navigate('/teacher/upload')}>
                <DocumentPlusIcon className="w-6 h-6 mr-2 inline"/> Upload Content
            </Button>
            <Button onClick={() => navigate('/teacher/create-quiz')} variant="secondary">
                <PlusCircleIcon className="w-6 h-6 mr-2 inline"/> Create a Quiz
            </Button>
        </div>

        <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Class Performance</h2>
            <ProgressChart data={allStudentsData} />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <UserGroupIcon className="w-6 h-6 mr-2 text-teal-500"/>
                Student Roster
            </h2>
            <div className="max-h-96 overflow-y-auto">
                <ul className="space-y-2">
                {allStudentsData.map(student => (
                    <li key={student.id}>
                        <button 
                            onClick={() => setSelectedStudent(student)}
                            className={`w-full text-left p-3 rounded-lg transition ${selectedStudent?.id === student.id ? 'bg-teal-100 dark:bg-teal-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{student.name}</span>
                                <span className="text-sm text-slate-500">Grade {student.grade}</span>
                            </div>
                        </button>
                    </li>
                ))}
                </ul>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Student Details</h2>
            {selectedStudent ? (
                <div className="space-y-3">
                    <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                    <p><strong>Level:</strong> {selectedStudent.level}</p>
                    <p><strong>Coins:</strong> {selectedStudent.coins}</p>
                    <p><strong>Badges:</strong> {selectedStudent.badges.join(', ') || 'None'}</p>
                    <h4 className="font-semibold mt-4">Progress:</h4>
                     {Object.entries(selectedStudent.progress).map(([subjectId, data]) => (
                        <div key={subjectId} className="text-sm">
                            <p className="capitalize font-medium">{subjectId}: {data.completionPercentage}% complete</p>
                        </div>
                     ))}
                     {Object.keys(selectedStudent.progress).length === 0 && <p className="text-sm text-slate-500">No progress yet.</p>}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                    <p>Select a student to view their details.</p>
                </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;