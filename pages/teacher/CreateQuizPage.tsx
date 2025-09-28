
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { QuizQuestion } from '../../types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

const CreateQuizPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('math');
    const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([{ type: 'mcq', question: '', options: ['', ''], answer: '' }]);

    const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
        const newQuestions = [...questions];
        (newQuestions[index] as any)[field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options) {
            (newQuestions[qIndex].options as string[])[oIndex] = value;
            setQuestions(newQuestions);
        }
    };
    
    const addQuestion = () => setQuestions([...questions, { type: 'mcq', question: '', options: ['', ''], answer: '' }]);
    const removeQuestion = (index: number) => setQuestions(questions.filter((_, i) => i !== index));

    const addOption = (qIndex: number) => {
        const newQuestions = [...questions];
        (newQuestions[qIndex].options as string[]).push('');
        setQuestions(newQuestions);
    };
    const removeOption = (qIndex: number, oIndex: number) => {
         const newQuestions = [...questions];
        (newQuestions[qIndex].options as string[]).splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Quiz "${title}" created for ${subject}!`);
    };

    return (
        <Layout>
            <Link to="/teacher/dashboard" className="text-teal-500 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
            <h1 className="text-4xl font-bold mb-8">Create New Quiz</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Quiz Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 bg-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Subject</label>
                            <select value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 bg-white dark:bg-slate-800">
                                <option value="math">Mathematics</option>
                                <option value="science">Science</option>
                                <option value="social">Social Studies</option>
                                <option value="english">English</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {questions.map((q, qIndex) => (
                    <Card key={qIndex} className="p-6">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>
                             <button type="button" onClick={() => removeQuestion(qIndex)}><TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700"/></button>
                        </div>
                        <div className="space-y-4">
                            <textarea value={q.question} onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)} placeholder="Question text" required className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 bg-transparent" />
                            <select value={q.type} onChange={e => handleQuestionChange(qIndex, 'type', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 bg-white dark:bg-slate-800">
                                <option value="mcq">Multiple Choice</option>
                                <option value="fill-in-the-blanks">Fill in the Blanks</option>
                            </select>
                            {q.type === 'mcq' && q.options?.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                    <input type="text" value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} required className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 bg-transparent"/>
                                    <button type="button" onClick={() => removeOption(qIndex, oIndex)}><TrashIcon className="w-5 h-5 text-slate-500 hover:text-red-500"/></button>
                                </div>
                            ))}
                             {q.type === 'mcq' && <Button type="button" variant="secondary" onClick={() => addOption(qIndex)} className="text-sm py-1 px-3">Add Option</Button>}
                            <input type="text" value={q.answer} onChange={e => handleQuestionChange(qIndex, 'answer', e.target.value)} placeholder="Correct Answer" required className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 bg-transparent" />
                        </div>
                    </Card>
                ))}
                <div className="flex justify-between">
                    <Button type="button" variant="secondary" onClick={addQuestion}><PlusIcon className="w-5 h-5 mr-2 inline"/>Add Question</Button>
                    <Button type="submit">Create Quiz</Button>
                </div>
            </form>
        </Layout>
    );
};

export default CreateQuizPage;