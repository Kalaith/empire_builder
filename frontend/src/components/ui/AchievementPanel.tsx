import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import type { Achievement } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

const AchievementPanel: React.FC = () => {
  const { achievements } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'combat' | 'building' | 'heroes' | 'economy' | 'exploration'>('all');

  const filteredAchievements = achievements.filter(achievement => {
    const statusMatch = filter === 'all' ||
      (filter === 'unlocked' && achievement.isUnlocked) ||
      (filter === 'locked' && !achievement.isUnlocked);

    const categoryMatch = categoryFilter === 'all' || achievement.category === categoryFilter;

    return statusMatch && categoryMatch;
  });

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'combat': return '⚔️';
      case 'building': return '🏗️';
      case 'heroes': return '👑';
      case 'economy': return '💰';
      case 'exploration': return '🗺️';
      default: return '🏆';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'combat': return 'text-red-600 bg-red-100';
      case 'building': return 'text-blue-600 bg-blue-100';
      case 'heroes': return 'text-purple-600 bg-purple-100';
      case 'economy': return 'text-green-600 bg-green-100';
      case 'exploration': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // const getProgressPercentage = (achievement: Achievement) => {
  //   if (achievement.isUnlocked) return 100;

  //   const progressValues = Object.entries(achievement.progress).map(([key, current]) => {
  //     const required = achievement.requirements[key] || 1;
  //     return Math.min((current / required) * 100, 100);
  //   });

  //   return progressValues.length > 0 ? Math.max(...progressValues) : 0;
  // };

  return (
    <div className="achievement-panel bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
          <p className="text-sm text-gray-600">
            {unlockedCount}/{totalCount} unlocked ({Math.round((unlockedCount / totalCount) * 100)}%)
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl">🏆</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-1 flex-wrap">
          {(['all', 'unlocked', 'locked'] as const).map(filterType => (
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

        <div className="flex gap-1 flex-wrap">
          {(['all', 'combat', 'building', 'heroes', 'economy', 'exploration'] as const).map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-2 py-1 text-xs rounded capitalize flex items-center gap-1 ${
                categoryFilter === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{getCategoryIcon(category)}</span>
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Achievement List */}
      <div className="achievement-list space-y-3 max-h-96 overflow-y-auto">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`achievement-item border rounded-lg p-3 ${
              achievement.isUnlocked
                ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100'
                : 'border-gray-200 bg-white opacity-75'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Achievement Icon */}
              <div className={`text-2xl p-2 rounded-lg ${
                achievement.isUnlocked ? 'bg-yellow-200' : 'bg-gray-100'
              }`}>
                {achievement.isUnlocked ? '🏆' : achievement.icon}
              </div>

              <div className="flex-1">
                {/* Achievement Header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-medium ${achievement.isUnlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                      {achievement.title}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${getCategoryColor(achievement.category)}`}>
                      {getCategoryIcon(achievement.category)} {achievement.category}
                    </span>
                  </div>

                  {achievement.isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-yellow-600 text-lg"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>

                <p className={`text-sm mb-3 ${achievement.isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>

                {/* Progress */}
                {!achievement.isUnlocked && (
                  <div className="space-y-2 mb-3">
                    {Object.entries(achievement.requirements).map(([key, required]) => {
                      const current = achievement.progress[key] || 0;
                      const percentage = Math.min((current / required) * 100, 100);

                      return (
                        <div key={key} className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-gray-500">{current}/{required}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Rewards */}
                <div className="rewards flex gap-2 text-xs">
                  <span className="text-gray-600">Rewards:</span>
                  {achievement.rewards.gold && (
                    <span className="text-yellow-600">💰{achievement.rewards.gold}</span>
                  )}
                  {achievement.rewards.mana && (
                    <span className="text-blue-600">🔮{achievement.rewards.mana}</span>
                  )}
                  {achievement.rewards.supplies && (
                    <span className="text-green-600">📦{achievement.rewards.supplies}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No achievements found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default AchievementPanel;