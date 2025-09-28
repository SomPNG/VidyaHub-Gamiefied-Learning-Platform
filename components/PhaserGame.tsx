import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface PhaserGameProps {
  config: Phaser.Types.Core.GameConfig;
  onGameComplete: (data: { score: number }) => void;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ config, onGameComplete }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserInstance = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current && !phaserInstance.current) {
      // Create a new game instance
      const game = new Phaser.Game({ ...config, parent: gameRef.current });
      
      // Listen for the custom 'gameComplete' event from the Phaser scene
      game.events.on('gameComplete', onGameComplete);
      
      phaserInstance.current = game;
    }

    return () => {
      // Clean up the event listener and destroy the game instance
      phaserInstance.current?.events.off('gameComplete', onGameComplete);
      phaserInstance.current?.destroy(true);
      phaserInstance.current = null;
    };
  }, [config, onGameComplete]);

  return <div ref={gameRef} id="phaser-game-container" className="w-full h-full flex justify-center items-center" />;
};

export default PhaserGame;