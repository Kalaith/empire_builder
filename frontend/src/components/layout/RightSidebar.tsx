import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import type { Building, Hero, Enemy, Flag } from '../../types/game';
import HeroDetailsModal from '../ui/HeroDetailsModal';
import BuildingUpgradeModal from '../ui/BuildingUpgradeModal';
import QuestPanel from '../ui/QuestPanel';
import AchievementPanel from '../ui/AchievementPanel';
import SaveLoadMenu from '../ui/SaveLoadMenu';

const RightSidebar: React.FC = () => {
  const { heroes, pauseGame, resumeGame, isPaused } = useGameStore();
  const { selectedEntity, selectEntity } = useUIStore();
  const [activePanel, setActivePanel] = useState<
    'info' | 'quests' | 'achievements' | 'heroes' | 'saves'
  >('info');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [saveLoadMenu, setSaveLoadMenu] = useState<{
    isOpen: boolean;
    mode: 'save' | 'load';
  }>({ isOpen: false, mode: 'save' });

  const renderSelectedInfo = () => {
    if (!selectedEntity) {
      return <p className="text-gray-500">Click on a building, hero, or enemy to see details</p>;
    }

    const { entity, type } = selectedEntity;

    switch (type) {
      case 'building': {
        const building = entity as Building;
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <span className="text-2xl">{building.symbol}</span>
                {building.name}
              </h4>
              <button
                onClick={() => setSelectedBuilding(building)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Upgrade
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Level:</strong> {building.level}
              </div>
              <div>
                <strong>Type:</strong> {building.type}
              </div>
              <div>
                <strong>Health:</strong> {building.healthPoints}/{building.maxHealthPoints}
              </div>
              <div>
                <strong>Position:</strong> ({building.x}, {building.y})
              </div>
            </div>
            {building.production && (
              <div className="bg-green-50 p-2 rounded">
                <div className="text-sm font-medium text-green-800 mb-1">Production:</div>
                <div className="text-xs text-green-700">
                  {building.production.gold && `💰 +${building.production.gold}/min`}
                  {building.production.mana && ` 🔮 +${building.production.mana}/min`}
                  {building.production.supplies && ` 📦 +${building.production.supplies}/min`}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'hero': {
        const hero = entity as Hero;
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <span className="text-2xl">{hero.symbol}</span>
                {hero.heroName}
              </h4>
              <button
                onClick={() => setSelectedHero(hero)}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
              >
                Details
              </button>
            </div>

            {/* Level and Experience Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>
                  <strong>Level {hero.level}</strong> {hero.className}
                </span>
                <span className="text-xs text-gray-500">
                  {hero.experience}/{hero.experienceToNext} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${(hero.experience / hero.experienceToNext) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Health Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>
                  <strong>Health:</strong> {hero.health}/{hero.maxHealth}
                </span>
                <span
                  className={`text-xs ${
                    hero.health / hero.maxHealth > 0.7
                      ? 'text-green-600'
                      : hero.health / hero.maxHealth > 0.3
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {Math.round((hero.health / hero.maxHealth) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    hero.health / hero.maxHealth > 0.7
                      ? 'bg-green-500'
                      : hero.health / hero.maxHealth > 0.3
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${(hero.health / hero.maxHealth) * 100}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Damage:</strong> {hero.damage}
              </div>
              <div>
                <strong>Speed:</strong> {hero.speed}
              </div>
              <div>
                <strong>Gold:</strong> 💰{hero.gold}
              </div>
              <div>
                <strong>Morale:</strong> {hero.morale}/100
              </div>
            </div>

            {/* Status */}
            <div className="bg-blue-50 p-2 rounded">
              <div className="text-xs font-medium text-blue-800">Status:</div>
              <div className="text-xs text-blue-700 capitalize">{hero.lastAction}</div>
            </div>

            {/* Specialization */}
            {hero.specialization && (
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-xs font-medium text-purple-800">
                  {hero.specialization.name}
                </div>
                <div className="text-xs text-purple-600">{hero.specialization.description}</div>
              </div>
            )}
          </div>
        );
      }

      case 'enemy': {
        const enemy = entity as Enemy;
        return (
          <div className="space-y-2">
            <h4 className="font-bold text-lg">{enemy.name}</h4>
            <p>
              <strong>Health:</strong> {enemy.health}/{enemy.maxHealth}
            </p>
            <p>
              <strong>Damage:</strong> {enemy.damage}
            </p>
            <p>
              <strong>Reward:</strong> {enemy.reward} gold
            </p>
            <p>
              <strong>Position:</strong> ({enemy.x}, {enemy.y})
            </p>
          </div>
        );
      }

      case 'flag': {
        const flag = entity as Flag;
        return (
          <div className="space-y-2">
            <h4 className="font-bold text-lg">{flag.name}</h4>
            <p>
              <strong>Type:</strong> {flag.type}
            </p>
            <p>
              <strong>Reward:</strong> {flag.reward} gold
            </p>
            <p>
              <strong>Position:</strong> ({flag.x}, {flag.y})
            </p>
          </div>
        );
      }

      default:
        return <p>Unknown entity type</p>;
    }
  };

  return (
    <div className="right-sidebar w-80 space-y-4">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex gap-1">
          {[
            { id: 'info', label: 'Info', icon: 'ℹ️' },
            { id: 'heroes', label: 'Heroes', icon: '🦸' },
            { id: 'quests', label: 'Quests', icon: '📋' },
            { id: 'achievements', label: 'Awards', icon: '🏆' },
            { id: 'saves', label: 'Saves', icon: '💾' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() =>
                setActivePanel(tab.id as 'info' | 'heroes' | 'quests' | 'achievements' | 'saves')
              }
              className={`flex-1 py-2 px-2 rounded text-xs font-medium transition-colors ${
                activePanel === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="text-sm">{tab.icon}</div>
              <div>{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel Content */}
      <div className="bg-white rounded-lg shadow-md p-4 min-h-96">
        {activePanel === 'info' && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span>ℹ️</span> Information
            </h3>
            <div className="selected-info min-h-32">{renderSelectedInfo()}</div>
          </div>
        )}

        {activePanel === 'heroes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>🦸</span> Heroes ({heroes.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={isPaused ? resumeGame : pauseGame}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    isPaused
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                </button>
              </div>
            </div>
            <div className="hero-list space-y-2 max-h-80 overflow-y-auto">
              {heroes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏰</div>
                  <p className="font-medium">No heroes recruited yet</p>
                  <p className="text-sm">Build a guild to recruit heroes!</p>
                </div>
              ) : (
                heroes.map(hero => (
                  <div
                    key={hero.id}
                    className="hero-item p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => selectEntity(hero, 'hero')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="hero-avatar text-2xl">{hero.symbol}</span>
                      <div className="hero-details flex-1">
                        <div className="hero-name font-medium text-sm">{hero.heroName}</div>
                        <div className="hero-class text-xs text-gray-600 mb-1">
                          Level {hero.level} {hero.className}
                        </div>

                        {/* Mini health bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
                          <div
                            className={`h-1 rounded-full ${
                              hero.health / hero.maxHealth > 0.7
                                ? 'bg-green-500'
                                : hero.health / hero.maxHealth > 0.3
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                            style={{
                              width: `${(hero.health / hero.maxHealth) * 100}%`,
                            }}
                          />
                        </div>

                        <div className="hero-stats flex justify-between text-xs text-gray-600">
                          <span>
                            HP: {hero.health}/{hero.maxHealth}
                          </span>
                          <span>💰{hero.gold}</span>
                          <span className="capitalize">{hero.lastAction}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activePanel === 'quests' && <QuestPanel />}

        {activePanel === 'achievements' && <AchievementPanel />}

        {activePanel === 'saves' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>💾</span> Save & Load
              </h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setSaveLoadMenu({ isOpen: true, mode: 'save' })}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                💾 Save Game
              </button>
              <button
                onClick={() => setSaveLoadMenu({ isOpen: true, mode: 'load' })}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                📁 Load Game
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedHero && (
        <HeroDetailsModal
          hero={selectedHero}
          isOpen={!!selectedHero}
          onClose={() => setSelectedHero(null)}
        />
      )}

      {selectedBuilding && (
        <BuildingUpgradeModal
          building={selectedBuilding}
          isOpen={!!selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
        />
      )}

      {saveLoadMenu.isOpen && (
        <SaveLoadMenu
          isOpen={saveLoadMenu.isOpen}
          onClose={() => setSaveLoadMenu({ isOpen: false, mode: 'save' })}
          mode={saveLoadMenu.mode}
        />
      )}
    </div>
  );
};

export default RightSidebar;
