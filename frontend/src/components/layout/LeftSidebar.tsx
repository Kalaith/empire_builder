import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { BUILDING_TYPES } from '../../data/gameData';
import type { ResourceCost } from '../../types/game';

const LeftSidebar: React.FC = () => {
  const { spawnHero, canAfford } = useGameStore();
  const { selectedBuildingType, selectBuildingType, addGameMessage } = useUIStore();

  const handleBuildingClick = (type: string) => {
    selectBuildingType(type);
    addGameMessage(`Selected ${BUILDING_TYPES[type].name} - click empty cell to build`, 'info');
  };

  const handleSpawnHero = (guildType: string) => {
    const hero = spawnHero(guildType);
    if (hero) {
      addGameMessage(`Recruited ${hero.heroName}!`, 'success');
    } else {
      addGameMessage('Cannot recruit hero - no available guild!', 'error');
    }
  };

  const formatCost = (cost: ResourceCost) => {
    const parts = [];
    if (cost.gold) parts.push(`${cost.gold}g`);
    if (cost.mana) parts.push(`${cost.mana}m`);
    if (cost.supplies) parts.push(`${cost.supplies}s`);
    if (cost.population) parts.push(`${cost.population}p`);
    return parts.join(' ');
  };

  const buildingCategories = [
    {
      title: 'Guilds',
      buildings: ['warriorGuild', 'rangerGuild', 'wizardGuild', 'rogueGuild']
    },
    {
      title: 'Economy',
      buildings: ['marketplace', 'blacksmith', 'inn']
    },
    {
      title: 'Defense',
      buildings: ['guardTower']
    }
  ];

  return (
    <div className="left-sidebar w-80 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Buildings</h3>
      <div className="building-menu space-y-4">
        {buildingCategories.map((category) => (
          <div key={category.title} className="building-category">
            <h4 className="text-md font-semibold mb-2 text-gray-700">{category.title}</h4>
            <div className="building-list space-y-2">
              {category.buildings.map((buildingType) => {
                const building = BUILDING_TYPES[buildingType];
                const canAffordBuilding = canAfford(building.cost);
                const isSelected = selectedBuildingType === buildingType;

                return (
                  <div key={buildingType} className="building-item space-y-2">
                    <button
                      className={`building-btn w-full flex items-center gap-2 p-3 rounded border transition-colors ${
                        isSelected
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : canAffordBuilding
                            ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => handleBuildingClick(buildingType)}
                      disabled={!canAffordBuilding}
                    >
                      <span className="building-icon text-2xl">{building.symbol}</span>
                      <div className="flex-1 text-left">
                        <div className="building-name text-sm font-medium">{building.name}</div>
                        <div className={`building-cost text-xs ${
                          canAffordBuilding ? 'text-green-600' : 'text-red-500'
                        }`}>
                          Cost: {formatCost(building.cost)}
                        </div>
                      </div>
                    </button>
                    {buildingType.includes('Guild') && (
                      <button
                        className="w-full px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                        onClick={() => handleSpawnHero(buildingType)}
                      >
                        🦸 Recruit Hero
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
