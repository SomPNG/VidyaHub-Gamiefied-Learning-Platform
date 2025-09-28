
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 text-white p-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-down">VidyaHub</h1>
        <p className="text-lg md:text-2xl mb-12 animate-fade-in-up">Your Adventure in Learning Begins Here.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 animate-fade-in">
        <Button 
          className="text-xl px-10 py-5"
          onClick={() => navigate('/login/student')}
        >
          I am a Student
        </Button>
        <Button 
          variant="secondary"
          className="text-xl px-10 py-5"
          onClick={() => navigate('/login/teacher')}
        >
          I am a Teacher
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;