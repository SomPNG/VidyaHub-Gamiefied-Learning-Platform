import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: UserRole }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('6'); // Default to grade 6

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && role) {
      const studentGrade = role === 'student' ? parseInt(grade) || 6 : undefined;
      login(name, role, studentGrade);
      navigate(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
    }
  };
  
  if (!role || (role !== 'student' && role !== 'teacher')) {
      // Handle invalid role
      navigate('/');
      return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 capitalize">{role} Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-transparent"
                placeholder="e.g., Jane Doe"
              />
            </div>
          </div>

          {role === 'student' && (
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Class / Standard
              </label>
              <div className="mt-1">
                <select
                  id="grade"
                  name="grade"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800"
                >
                  {Array.from({ length: 7 }, (_, i) => 6 + i).map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;