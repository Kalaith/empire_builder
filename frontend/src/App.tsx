import React, { useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import { useUIStore } from './stores/uiStore';
import { useGameLoop } from './hooks/useGameLoop';
import TopBar from './components/layout/TopBar';
import LeftSidebar from './components/layout/LeftSidebar';
import GameGrid from './components/game/GameGrid';
import RightSidebar from './components/layout/RightSidebar';
import GameMessages from './components/ui/GameMessages';
import GameOverModal from './components/ui/GameOverModal';
import { gameConfig } from './data/gameData';

const App: React.FC = () => {
  const { initializeGrid, placeCastle, collectIncome, spawnEnemy, isGameRunning, loadBackendState } =
    useGameStore();
  const { addGameMessage } = useUIStore();

  // Use the game loop hook
  useGameLoop();

  // Initialize game on mount
  useEffect(() => {
    void (async () => {
      await loadBackendState();
      if (useGameStore.getState().buildings.length === 0) {
        initializeGrid();
        placeCastle();
      }
      addGameMessage('Welcome to your kingdom! Build guilds to recruit heroes.', 'success');
    })();
  }, [initializeGrid, placeCastle, addGameMessage, loadBackendState]);

  // Income collection loop
  useEffect(() => {
    if (!isGameRunning()) return;

    const incomeLoop = setInterval(() => {
      collectIncome();
    }, gameConfig.INCOME_INTERVAL);

    return () => clearInterval(incomeLoop);
  }, [collectIncome, isGameRunning]);

  // Enemy spawn loop
  useEffect(() => {
    if (!isGameRunning()) return;

    const enemyLoop = setInterval(() => {
      spawnEnemy();
    }, gameConfig.ENEMY_SPAWN_INTERVAL);

    return () => clearInterval(enemyLoop);
  }, [spawnEnemy, isGameRunning]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="game-container max-w-7xl mx-auto p-4">
        <TopBar />
        <div className="main-content flex gap-4 mt-4">
          <LeftSidebar />
          <GameGrid />
          <RightSidebar />
        </div>
        <GameMessages />
        <GameOverModal />
      </div>
    </div>
  );
};

export default App;
