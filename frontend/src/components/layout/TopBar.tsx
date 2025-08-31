import React from 'react';
import { useGameStore } from '../../stores/gameStore';

const TopBar: React.FC = () => {
  const { gold, heroes, buildings, enemies } = useGameStore();

  return (
    <div className="top-bar bg-white rounded-lg shadow-md p-4">
      <div className="stat-display flex gap-6 justify-center">
        <div className="stat-item flex items-center gap-2">
          <span className="stat-icon text-yellow-500 text-lg">💰</span>
          <span className="stat-label font-medium">Gold:</span>
          <span className="stat-value text-xl font-bold text-yellow-600">{gold}</span>
        </div>
        <div className="stat-item flex items-center gap-2">
          <span className="stat-icon text-blue-500 text-lg">👥</span>
          <span className="stat-label font-medium">Heroes:</span>
          <span className="stat-value text-xl font-bold text-blue-600">{heroes.length}</span>
        </div>
        <div className="stat-item flex items-center gap-2">
          <span className="stat-icon text-green-500 text-lg">🏠</span>
          <span className="stat-label font-medium">Population:</span>
          <span className="stat-value text-xl font-bold text-green-600">{buildings.length}</span>
        </div>
        <div className="stat-item flex items-center gap-2">
          <span className="stat-icon text-red-500 text-lg">⚔️</span>
          <span className="stat-label font-medium">Enemies:</span>
          <span className="stat-value text-xl font-bold text-red-600">{enemies.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
