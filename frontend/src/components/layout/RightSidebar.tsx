import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import type { Building, Hero, Enemy, Flag } from '../../types/game';

const RightSidebar: React.FC = () => {
  const { heroes } = useGameStore();
  const { selectedEntity, selectEntity } = useUIStore();

  const renderSelectedInfo = () => {
    if (!selectedEntity) {
      return <p className="text-gray-500">Click on a building, hero, or enemy to see details</p>;
    }

    const { entity, type } = selectedEntity;

    switch (type) {
      case 'building': {
        const building = entity as Building;
        return (
          <div className="space-y-2">
            <h4 className="font-bold text-lg">{building.name}</h4>
            <p><strong>Type:</strong> {building.type}</p>
            <p><strong>Income:</strong> {building.income} gold/turn</p>
            <p><strong>Position:</strong> ({building.x}, {building.y})</p>
          </div>
        );
      }

      case 'hero': {
        const hero = entity as Hero;
        return (
          <div className="space-y-2">
            <h4 className="font-bold text-lg">{hero.name}</h4>
            <p><strong>Level:</strong> {hero.level}</p>
            <p><strong>Health:</strong> {hero.health}/{hero.maxHealth}</p>
            <p><strong>Damage:</strong> {hero.damage}</p>
            <p><strong>Gold:</strong> {hero.gold}</p>
            <p><strong>Experience:</strong> {hero.experience}</p>
            <p><strong>Position:</strong> ({hero.x}, {hero.y})</p>
            <p><strong>Status:</strong> {hero.lastAction}</p>
          </div>
        );
      }

      case 'enemy': {
        const enemy = entity as Enemy;
        return (
          <div className="space-y-2">
            <h4 className="font-bold text-lg">{enemy.name}</h4>
            <p><strong>Health:</strong> {enemy.health}/{enemy.maxHealth}</p>
            <p><strong>Damage:</strong> {enemy.damage}</p>
            <p><strong>Reward:</strong> {enemy.reward} gold</p>
            <p><strong>Position:</strong> ({enemy.x}, {enemy.y})</p>
          </div>
        );
      }

      case 'flag': {
        const flag = entity as Flag;
        return (
          <div className="space-y-2">
            <h4 className="font-bold text-lg">{flag.name}</h4>
            <p><strong>Type:</strong> {flag.type}</p>
            <p><strong>Reward:</strong> {flag.reward} gold</p>
            <p><strong>Position:</strong> ({flag.x}, {flag.y})</p>
          </div>
        );
      }

      default:
        return <p>Unknown entity type</p>;
    }
  };

  return (
    <div className="right-sidebar w-80 space-y-4">
      {/* Info Panel */}
      <div className="info-panel bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Information</h3>
        <div className="selected-info min-h-32">
          {renderSelectedInfo()}
        </div>
      </div>

      {/* Hero List */}
      <div className="hero-panel bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Active Heroes</h3>
        <div className="hero-list space-y-2 max-h-64 overflow-y-auto">
          {heroes.length === 0 ? (
            <p className="empty-message text-gray-500 italic">No heroes recruited yet</p>
          ) : (
            heroes.map((hero) => (
              <div
                key={hero.id}
                className="hero-item p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => selectEntity(hero, 'hero')}
              >
                <div className="flex items-center gap-2">
                  <span className="hero-avatar text-lg">{hero.symbol}</span>
                  <div className="hero-details flex-1">
                    <div className="hero-name font-medium">{hero.name}</div>
                    <div className="hero-stats text-sm text-gray-600">
                      Lv.{hero.level} • HP: {hero.health}/{hero.maxHealth} • 💰{hero.gold}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
