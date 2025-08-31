import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { BUILDING_TYPES } from '../../data/gameData';

const LeftSidebar: React.FC = () => {
  const { gold, spawnHero } = useGameStore();
  const { selectedBuildingType, selectBuildingType, addGameMessage } = useUIStore();

  const handleBuildingClick = (type: string) => {
    selectBuildingType(type);
    addGameMessage(`Selected ${BUILDING_TYPES[type].name} - click empty cell to build`, 'info');
  };

  const handleSpawnHero = (guildType: string) => {
    const hero = spawnHero(guildType);
    if (hero) {
      addGameMessage(`Recruited ${hero.name}!`, 'success');
    } else {
      addGameMessage('Cannot recruit hero - no available guild!', 'error');
    }
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
                const canAfford = gold >= building.cost;
                const isSelected = selectedBuildingType === buildingType;

                return (
                  <div key={buildingType} className="flex items-center justify-between">
                    <button
                      className={`building-btn flex-1 flex items-center gap-2 p-2 rounded border transition-colors ${
                        isSelected
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : canAfford
                            ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => handleBuildingClick(buildingType)}
                      disabled={!canAfford}
                    >
                      <span className="building-icon text-lg">{building.symbol}</span>
                      <span className="building-name text-sm">{building.name}</span>
                      <span className={`building-cost text-xs ml-auto ${canAfford ? 'text-green-600' : 'text-red-500'}`}>
                        {building.cost}g
                      </span>
                    </button>
                    {buildingType.includes('Guild') && (
                      <button
                        className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                        onClick={() => handleSpawnHero(buildingType)}
                      >
                        Recruit
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
