
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import QuizGame from '../components/QuizGame';
import { useData } from '../context/DataContext';
import { generateTutorContent, AITutorResponse } from '../services/geminiService';
import { SparklesIcon } from '@heroicons/react/24/solid';

const AITutorPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AITutorResponse | null>(null);
    const [quizStarted, setQuizStarted] = useState(false);
    const { addCoins } = useData();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) return;
        setLoading(true);
        setError(null);
        setResult(null);
        setQuizStarted(false);
        try {
            const response = await generateTutorContent(topic);
            setResult(response);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleQuizComplete = (score: number) => {
        const coinsEarned = 100 + score;
        addCoins(coinsEarned);
        alert(`Quiz complete! You earned ${coinsEarned} coins!`);
        setQuizStarted(false);
        setResult(null);
        setTopic('');
    };

    return (
        <Layout>
             <div className="text-center">
                <SparklesIcon className="w-16 h-16 mx-auto text-teal-400" />
                <h1 className="text-4xl font-bold mt-4">AI Tutor Assistant</h1>
                <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Stuck on a topic? Type it below and our AI will explain it and create a fun quiz for you!</p>
            </div>
            
            <Card className="max-w-2xl mx-auto mt-8 p-6">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="flex-grow p-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., Photosynthesis, Pythagorean Theorem..."
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Generating...' : 'Explain & Quiz Me!'}
                    </Button>
                </form>
            </Card>

            {error && <p className="text-center text-red-500 mt-4">{error}</p>}

            {result && !quizStarted && (
                <Card className="max-w-4xl mx-auto mt-8 p-8">
                    <h2 className="text-3xl font-bold mb-4">Explanation: {topic}</h2>
                    <div className="prose dark:prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: result.explanation.replace(/\n/g, '<br />') }} />
                    <Button onClick={() => setQuizStarted(true)}>Start Quiz</Button>
                </Card>
            )}

            {result && quizStarted && (
                <div className="max-w-4xl mx-auto mt-8">
                    <h2 className="text-3xl font-bold mb-4 text-center">Quiz Time!</h2>
                    <QuizGame questions={result.quiz} onComplete={handleQuizComplete} />
                </div>
            )}
        </Layout>
    );
};

export default AITutorPage;