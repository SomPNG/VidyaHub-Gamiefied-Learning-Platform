
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getRecommendations } from '../services/geminiService';
import { Recommendation } from '../types';
import Card from './ui/Card';
import { LightBulbIcon, PlayCircleIcon, DocumentTextIcon, PuzzlePieceIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';

const RecommendationEngine: React.FC = () => {
    const { studentData, subjects } = useData();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!studentData) return;
            try {
                setLoading(true);
                const result = await getRecommendations(studentData, subjects);
                setRecommendations(result);
            } catch (err) {
                setError('Could not fetch recommendations.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [studentData, subjects]);

    const contentIcons: { [key: string]: React.ElementType } = {
        lecture: PlayCircleIcon,
        pdf: DocumentTextIcon,
        quiz: PuzzlePieceIcon,
        game: RocketLaunchIcon
    };

    if (loading) {
        return (
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <LightBulbIcon className="w-6 h-6 mr-2 text-yellow-500 animate-pulse" />
                    Personalized Suggestions
                </h2>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-lg p-4 animate-pulse h-20" />
                    ))}
                </div>
            </Card>
        );
    }
    
    if (error || recommendations.length === 0) {
        return null;
    }

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <LightBulbIcon className="w-6 h-6 mr-2 text-yellow-500" />
                What's Next for You?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((rec) => {
                    const Icon = contentIcons[rec.type] || LightBulbIcon;
                    return (
                        <Link to={`/student/subject/${rec.subjectId}`} key={rec.contentId}>
                           <div className="h-full p-4 rounded-lg bg-teal-50 dark:bg-teal-900/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <Icon className="w-6 h-6 mr-2 text-teal-500"/>
                                        <h3 className="font-bold">{rec.title}</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{rec.reason}</p>
                                </div>
                               <span className="mt-2 text-xs font-semibold uppercase text-teal-600 dark:text-teal-400 self-start">{rec.type}</span>
                           </div>
                        </Link>
                    )
                })}
            </div>
        </Card>
    );
};

export default RecommendationEngine;