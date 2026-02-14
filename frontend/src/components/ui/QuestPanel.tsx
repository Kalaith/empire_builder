import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Quest } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

const QuestPanel: React.FC = () => {
  const { quests, heroes, startQuest, completeQuest } = useGameStore();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'available' | 'completed'>('all');

  const filteredQuests = quests.filter(quest => {
    switch (filter) {
      case 'active':
        return quest.isActive && !quest.isCompleted;
      case 'available':
        return !quest.isActive && !quest.isCompleted;
      case 'completed':
        return quest.isCompleted;
      default:
        return true;
    }
  });

  const handleStartQuest = (questId: string, heroId?: string) => {
    startQuest(questId, heroId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-orange-600 bg-orange-100';
      case 'legendary':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'kill':
        return '⚔️';
      case 'build':
        return '🏗️';
      case 'explore':
        return '🗺️';
      case 'collect':
        return '📦';
      case 'survive':
        return '🛡️';
      default:
        return '📋';
    }
  };

  return (
    <div className="quest-panel bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Quests</h2>
        <div className="flex gap-1">
          {(['all', 'available', 'active', 'completed'] as const).map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-2 py-1 text-xs rounded capitalize ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      <div className="quest-list space-y-3 max-h-96 overflow-y-auto">
        {filteredQuests.map(quest => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`quest-item border rounded-lg p-3 cursor-pointer transition-colors ${
              selectedQuest?.id === quest.id
                ? 'border-blue-500 bg-blue-50'
                : quest.isCompleted
                  ? 'border-green-300 bg-green-50'
                  : quest.isActive
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedQuest(selectedQuest?.id === quest.id ? null : quest)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(quest.type)}</span>
                <h3 className="font-medium text-gray-800">{quest.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}
                >
                  {quest.difficulty}
                </span>
                {quest.isCompleted && <span className="text-green-600 text-sm">✓</span>}
                {quest.isActive && <span className="text-yellow-600 text-sm">🔄</span>}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-2">{quest.description}</p>

            {/* Quest Objectives */}
            <div className="objectives space-y-1">
              {quest.objectives.map(objective => (
                <div key={objective.id} className="flex justify-between items-center text-xs">
                  <span
                    className={
                      objective.isCompleted ? 'text-green-600 line-through' : 'text-gray-600'
                    }
                  >
                    {objective.description}
                  </span>
                  <span
                    className={`font-medium ${objective.isCompleted ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    {objective.current}/{objective.target}
                  </span>
                </div>
              ))}
            </div>

            {/* Quest Rewards */}
            <div className="rewards flex gap-2 mt-2 text-xs text-gray-600">
              <span>Rewards:</span>
              {quest.rewards.gold && (
                <span className="text-yellow-600">💰{quest.rewards.gold}</span>
              )}
              {quest.rewards.mana && <span className="text-blue-600">🔮{quest.rewards.mana}</span>}
              {quest.rewards.supplies && (
                <span className="text-green-600">📦{quest.rewards.supplies}</span>
              )}
            </div>

            {/* Quest Actions */}
            {selectedQuest?.id === quest.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-gray-200"
              >
                {!quest.isActive && !quest.isCompleted && (
                  <div className="space-y-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleStartQuest(quest.id);
                      }}
                      className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Start Quest
                    </button>

                    {heroes.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <span className="mb-1 block">Assign Hero:</span>
                        <div className="flex gap-1 flex-wrap">
                          {heroes.map(hero => (
                            <button
                              key={hero.id}
                              onClick={e => {
                                e.stopPropagation();
                                handleStartQuest(quest.id, hero.id);
                              }}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                            >
                              {hero.heroName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {quest.isActive && quest.objectives.every(obj => obj.isCompleted) && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      completeQuest(quest.id);
                    }}
                    className="w-full px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Complete Quest
                  </button>
                )}

                {quest.assignedHeroId && (
                  <div className="text-xs text-gray-600 mt-2">
                    Assigned to:{' '}
                    {heroes.find(h => h.id === quest.assignedHeroId)?.heroName || 'Unknown Hero'}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredQuests.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No quests found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default QuestPanel;
