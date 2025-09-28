import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QuizGame from '../../components/QuizGame';
import GameModal from '../../components/GameModal';
import { Chapter, ChapterContent } from '../../types';
import { PlayCircleIcon, DocumentTextIcon, PuzzlePieceIcon, RocketLaunchIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const SubjectPage: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const { subjects, studentData, completeContent } = useData();
    const [activeQuiz, setActiveQuiz] = useState<ChapterContent | null>(null);
    const [activeGame, setActiveGame] = useState<ChapterContent | null>(null);

    const subject = subjects.find(s => s.id === subjectId);
    
    if (!subject) {
        return <Layout><div>Subject not found.</div></Layout>;
    }
    
    const subjectProgress = studentData?.progress[subjectId!];

    const handleQuizComplete = (score: number) => {
        if (activeQuiz) {
            completeContent(subjectId!, activeQuiz.id, 'quiz', score);
        }
        setActiveQuiz(null);
    };

    const handleGameComplete = (score: number) => {
        if (activeGame) {
            completeContent(subjectId!, activeGame.id, 'game', score);
        }
        setActiveGame(null);
    };

    const contentIcons: { [key: string]: React.ElementType } = {
        lecture: PlayCircleIcon,
        pdf: DocumentTextIcon,
        quiz: PuzzlePieceIcon,
        game: RocketLaunchIcon
    };

    return (
        <Layout>
            {activeGame && (
                <GameModal 
                    gameContent={activeGame}
                    onClose={() => setActiveGame(null)}
                    onComplete={handleGameComplete}
                />
            )}

            <div className="mb-8">
                <Link to="/student/dashboard" className="text-teal-500 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                <div className="flex items-center">
                    <subject.icon className="w-12 h-12 mr-4 text-teal-500"/>
                    <h1 className="text-4xl font-bold">{subject.name}</h1>
                </div>
            </div>

            {activeQuiz && activeQuiz.questions ? (
                 <div>
                    <Button onClick={() => setActiveQuiz(null)} className="mb-4" variant="secondary">&larr; Back to Chapters</Button>
                    <h2 className="text-2xl font-bold mb-4">{activeQuiz.title}</h2>
                    <QuizGame questions={activeQuiz.questions} onComplete={handleQuizComplete} />
                </div>
            ) : (
                <div className="space-y-8">
                {subject.chapters.map((chapter: Chapter) => (
                    <Card key={chapter.id} className="p-6">
                        <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {chapter.content.map((content: ChapterContent) => {
                                const isCompleted = subjectProgress?.completedContent.includes(content.id);
                                const Icon = contentIcons[content.type];

                                return (
                                    <div key={content.id} className={`relative p-4 rounded-lg flex items-start gap-4 ${isCompleted ? 'bg-green-50 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                       {isCompleted && <CheckCircleIcon className="absolute top-2 right-2 w-5 h-5 text-green-500" />}
                                       <Icon className="w-8 h-8 text-teal-500 mt-1 flex-shrink-0" />
                                       <div>
                                            <h3 className="font-semibold">{content.title}</h3>
                                            <p className="text-sm text-slate-500">{content.description}</p>
                                            {content.type === 'quiz' && (
                                                <Button onClick={() => isCompleted ? undefined : setActiveQuiz(content)} disabled={isCompleted} className="mt-2 text-sm py-1 px-3">
                                                    {isCompleted ? 'Completed' : 'Start Quiz'}
                                                </Button>
                                            )}
                                            {content.type === 'game' && content.gameConfig && (
                                                <Button onClick={() => isCompleted ? undefined : setActiveGame(content)} disabled={isCompleted} className="mt-2 text-sm py-1 px-3">
                                                     {isCompleted ? 'Completed' : 'Start Game'}
                                                </Button>
                                            )}
                                            {['lecture', 'pdf'].includes(content.type) && (
                                                <Button onClick={() => isCompleted ? undefined : completeContent(subjectId!, content.id, content.type)} disabled={isCompleted} className="mt-2 text-sm py-1 px-3">
                                                    {isCompleted ? 'Completed' : `Mark as Done`}
                                                </Button>
                                            )}
                                       </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ))}
            </div>
            )}
        </Layout>
    );
};

export default SubjectPage;