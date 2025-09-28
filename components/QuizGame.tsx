import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface QuizGameProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [answerResult, setAnswerResult] = useState<{ selected: string; correct: boolean } | null>(null);

  const handleAnswer = (answer: string) => {
    if (answerResult) return; // Prevent answering again

    const isCorrect = answer.toLowerCase().trim() === questions[currentQuestionIndex].answer.toLowerCase().trim();
    if (isCorrect) {
      setScore(s => s + 10);
    }
    setAnswerResult({ selected: answer, correct: isCorrect });
  };
  
  const handleNextQuestion = () => {
    setAnswerResult(null);
    setInputValue('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      onComplete(score);
    }
  };

  if (isFinished) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-3xl font-bold text-teal-500 mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-6">Your Final Score: <span className="font-bold text-green-500">{score} / {questions.length * 10}</span></p>
        <Button onClick={() => { /* This re-enables quiz taking which might not be desired. Page should handle this. */ onComplete(score); }}>Finish</Button>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const getOptionClasses = (option: string) => {
    if (!answerResult) {
      return 'bg-slate-100 dark:bg-slate-700 hover:bg-teal-100 dark:hover:bg-teal-900';
    }
    const isSelected = option === answerResult.selected;
    const isCorrect = option === currentQuestion.answer;

    if (isCorrect) return 'bg-green-200 dark:bg-green-800 ring-2 ring-green-500';
    if (isSelected && !answerResult.correct) return 'bg-red-200 dark:bg-red-800 ring-2 ring-red-500';
    
    return 'bg-slate-100 dark:bg-slate-700 opacity-60';
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-4">
        <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <p className="text-lg font-bold text-green-500">Score: {score}</p>
        </div>
        <h3 className="text-xl md:text-2xl font-semibold mt-2">{currentQuestion.question}</h3>
      </div>
      
      {currentQuestion.type === 'mcq' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {currentQuestion.options.map(option => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={!!answerResult}
              className={`w-full text-left p-4 rounded-lg transition ${getOptionClasses(option)}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {currentQuestion.type === 'fill-in-the-blanks' && (
        <form onSubmit={(e) => { e.preventDefault(); handleAnswer(inputValue); }} className="mt-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow p-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Type your answer..."
            disabled={!!answerResult}
          />
          <Button type="submit" disabled={!!answerResult}>Submit</Button>
        </form>
      )}

      {answerResult && (
        <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="flex items-center mb-3">
                {answerResult.correct ? <CheckCircleIcon className="w-8 h-8 text-green-500 mr-2" /> : <XCircleIcon className="w-8 h-8 text-red-500 mr-2" />}
                <h4 className={`text-2xl font-bold ${answerResult.correct ? 'text-green-500' : 'text-red-500'}`}>
                    {answerResult.correct ? 'Correct!' : 'Incorrect'}
                </h4>
            </div>
            {!answerResult.correct && <p className="mb-2 font-semibold">The correct answer is: {currentQuestion.answer}</p>}
            <p className="text-slate-700 dark:text-slate-300">{currentQuestion.explanation}</p>
            <Button onClick={handleNextQuestion} className="mt-4 w-full">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
        </div>
      )}
    </Card>
  );
};

export default QuizGame;