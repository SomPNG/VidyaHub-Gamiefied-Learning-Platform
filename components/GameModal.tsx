import React from 'react';
import PhaserGame from './PhaserGame';
import { ChapterContent } from '../types';
import Button from './ui/Button';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface GameModalProps {
  gameContent: ChapterContent;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const GameModal: React.FC<GameModalProps> = ({ gameContent, onClose, onComplete }) => {
  if (!gameContent.gameConfig) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-[100] p-4">
        <div className="bg-slate-800 p-4 rounded-t-lg w-full max-w-4xl flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-white">{gameContent.title}</h2>
                <p className="text-sm text-slate-400">{gameContent.description}</p>
            </div>
            <Button onClick={onClose} variant="secondary" className="px-4 py-2">
                <XMarkIcon className="w-6 h-6"/>
            </Button>
        </div>
        <div className="bg-black w-full max-w-4xl h-full max-h-[80vh] rounded-b-lg overflow-hidden">
            <PhaserGame 
                config={gameContent.gameConfig}
                onGameComplete={(data) => onComplete(data.score)}
            />
        </div>
    </div>
  );
};

export default GameModal;