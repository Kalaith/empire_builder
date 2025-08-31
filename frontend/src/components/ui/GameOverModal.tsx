import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';

const GameOverModal: React.FC = () => {
  const { restartGame } = useGameStore();
  const { showGameOverModal, setShowGameOverModal, clearGameMessages } = useUIStore();

  const handleRestart = () => {
    restartGame();
    setShowGameOverModal(false);
    clearGameMessages();
  };

  if (!showGameOverModal) return null;

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-content bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Game Over!</h2>
        <p className="text-center mb-6 text-gray-600">
          Your kingdom has fallen! The enemy has reached your castle.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleRestart}
            className="btn btn--primary px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Start New Kingdom
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
