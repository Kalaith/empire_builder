import React, { useState, useEffect } from "react";
import { useGameStore } from "../../stores/gameStore";
import { motion, AnimatePresence } from "framer-motion";

const TopBar: React.FC = () => {
  const {
    resources,
    heroes,
    buildings,
    enemies,
    isPaused,
    gameTime,
    restartGame,
  } = useGameStore();
  const [showStats, setShowStats] = useState(false);
  const [resourceChanges, setResourceChanges] = useState<{
    [key: string]: number;
  }>({});

  // Track resource changes for animation
  useEffect(() => {
    const prevGold = resourceChanges.gold || 0;
    const goldChange = resources.gold - prevGold;
    if (prevGold > 0 && goldChange !== 0) {
      setResourceChanges((prev) => ({
        ...prev,
        goldChange,
        gold: resources.gold,
      }));
      setTimeout(() => {
        setResourceChanges((prev) => ({ ...prev, goldChange: 0 }));
      }, 1000);
    } else {
      setResourceChanges((prev) => ({ ...prev, gold: resources.gold }));
    }
  }, [resources.gold, resourceChanges.gold]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="top-bar bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex flex-col gap-4">
        {/* Header with Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">🏰</span>
              Empire Builder
            </h1>
            {isPaused && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-orange-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span className="text-orange-500">⏸️</span>
                <span className="text-orange-700 font-medium text-sm">
                  GAME PAUSED
                </span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              📊 {showStats ? "Hide" : "Stats"}
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to restart the game? All progress will be lost.",
                  )
                ) {
                  restartGame();
                }
              }}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium transition-colors"
            >
              🔄 Restart
            </button>
          </div>
        </div>

        {/* Resources Section - Enhanced */}
        <div className="resource-display flex gap-4 justify-center flex-wrap">
          {[
            {
              key: "gold",
              icon: "💰",
              value: resources.gold,
              color: "yellow",
              max: null,
            },
            {
              key: "mana",
              icon: "🔮",
              value: resources.mana,
              color: "blue",
              max: null,
            },
            {
              key: "supplies",
              icon: "📦",
              value: resources.supplies,
              color: "green",
              max: null,
            },
            {
              key: "population",
              icon: "👥",
              value: resources.population,
              color: "purple",
              max: resources.maxPopulation,
            },
          ].map((resource) => (
            <motion.div
              key={resource.key}
              className={`stat-item bg-${resource.color}-50 border border-${resource.color}-200 rounded-lg px-4 py-3 min-w-32`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`stat-icon text-${resource.color}-500 text-xl`}
                >
                  {resource.icon}
                </span>
                <span className="stat-label font-medium text-sm capitalize text-gray-700">
                  {resource.key}:
                </span>
              </div>
              <div
                className={`stat-value text-xl font-bold text-${resource.color}-700 relative`}
              >
                {Math.floor(resource.value)}
                {resource.max !== null && `/${resource.max}`}
                <AnimatePresence>
                  {resource.key === "gold" &&
                    resourceChanges.goldChange > 0 && (
                      <motion.span
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: -10 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute ml-2 text-green-500 text-sm font-medium"
                      >
                        +{Math.floor(resourceChanges.goldChange)}
                      </motion.span>
                    )}
                </AnimatePresence>
              </div>
              {/* Resource bar for population */}
              {resource.max !== null && (
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className={`bg-${resource.color}-500 h-1 rounded-full transition-all duration-300`}
                    style={{
                      width: `${(resource.value / resource.max) * 100}%`,
                    }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Game Stats Section - Collapsible */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="game-stats bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="stat-item bg-white rounded-lg p-3 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="stat-icon text-blue-500 text-lg">
                        🦸
                      </span>
                      <span className="stat-label font-medium">Heroes</span>
                    </div>
                    <span className="stat-value text-2xl font-bold text-blue-600">
                      {heroes.length}
                    </span>
                    {heroes.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Avg Level:{" "}
                        {Math.round(
                          heroes.reduce((sum, h) => sum + h.level, 0) /
                            heroes.length,
                        )}
                      </div>
                    )}
                  </div>

                  <div className="stat-item bg-white rounded-lg p-3 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="stat-icon text-amber-500 text-lg">
                        🏠
                      </span>
                      <span className="stat-label font-medium">Buildings</span>
                    </div>
                    <span className="stat-value text-2xl font-bold text-amber-600">
                      {buildings.length}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Total Income: +
                      {buildings.reduce(
                        (sum, b) => sum + (b.production.gold || 0),
                        0,
                      )}
                      /min
                    </div>
                  </div>

                  <div className="stat-item bg-white rounded-lg p-3 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="stat-icon text-red-500 text-lg">⚔️</span>
                      <span className="stat-label font-medium">Enemies</span>
                    </div>
                    <span
                      className={`stat-value text-2xl font-bold ${
                        enemies.length === 0
                          ? "text-green-600"
                          : enemies.length < 3
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {enemies.length}
                    </span>
                    <div
                      className={`text-xs mt-1 ${
                        enemies.length === 0
                          ? "text-green-500"
                          : enemies.length < 3
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                      {enemies.length === 0
                        ? "Safe"
                        : enemies.length < 3
                          ? "Minor Threat"
                          : "Under Attack!"}
                    </div>
                  </div>

                  <div className="stat-item bg-white rounded-lg p-3 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="stat-icon text-gray-500 text-lg">
                        ⏰
                      </span>
                      <span className="stat-label font-medium">Time</span>
                    </div>
                    <span className="stat-value text-2xl font-bold text-gray-600">
                      {formatTime(gameTime)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Session Time
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TopBar;
