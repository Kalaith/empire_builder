import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Hero, Equipment } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';
import { HERO_SPECIALIZATIONS, EQUIPMENT } from '../../data/gameData';

interface HeroDetailsModalProps {
  hero: Hero;
  isOpen: boolean;
  onClose: () => void;
}

const HeroDetailsModal: React.FC<HeroDetailsModalProps> = ({ hero, isOpen, onClose }) => {
  const { levelUpHero, assignSpecialization, equipItem, canAfford } = useGameStore();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment' | 'relationships'>('stats');

  if (!isOpen) return null;

  const canLevelUp = hero.experience >= hero.experienceToNext;
  const availableSpecializations = Object.values(HERO_SPECIALIZATIONS).filter(
    spec => hero.type && spec.id.includes(hero.type) && hero.level >= spec.unlockLevel && !hero.specialization
  );

  const handleLevelUp = () => {
    if (canLevelUp) {
      levelUpHero(hero.id);
    }
  };

  const handleSpecialization = (specializationId: string) => {
    assignSpecialization(hero.id, specializationId);
  };

  const handleEquipItem = (equipment: Equipment) => {
    if (canAfford({ gold: equipment.cost })) {
      equipItem(hero.id, equipment);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {hero.heroName} - Level {hero.level} {hero.className}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Hero Avatar and Basic Stats */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl bg-gray-100 p-4 rounded-lg">
            {hero.symbol}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Health:</strong> {hero.health}/{hero.maxHealth}</div>
              <div><strong>Damage:</strong> {hero.damage}</div>
              <div><strong>Speed:</strong> {hero.speed}</div>
              <div><strong>Morale:</strong> {hero.morale}/100</div>
              <div><strong>Gold:</strong> {hero.gold}</div>
              <div><strong>Quests:</strong> {hero.questsCompleted}</div>
            </div>
          </div>
        </div>

        {/* Experience and Level Up */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Experience</span>
            <span className="text-sm text-gray-600">
              {hero.experience}/{hero.experienceToNext}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${(hero.experience / hero.experienceToNext) * 100}%` }}
            />
          </div>
          {canLevelUp && (
            <button
              onClick={handleLevelUp}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Level Up!
            </button>
          )}
        </div>

        {/* Specialization Selection */}
        {availableSpecializations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Choose Specialization</h3>
            <div className="grid grid-cols-1 gap-2">
              {availableSpecializations.map(spec => (
                <div key={spec.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{spec.name}</h4>
                      <p className="text-sm text-gray-600">{spec.description}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        +{spec.healthBonus} HP, +{spec.damageBonus} DMG, +{spec.speedBonus} SPD
                      </div>
                    </div>
                    <button
                      onClick={() => handleSpecialization(spec.id)}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    >
                      Choose
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Specialization */}
        {hero.specialization && (
          <div className="mb-6 bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              {hero.specialization.name}
            </h3>
            <p className="text-purple-700 text-sm mb-2">{hero.specialization.description}</p>
            <div className="text-purple-600 text-xs">
              Special Abilities: {hero.specialization.specialAbilities.join(', ')}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b mb-4">
          <div className="flex gap-4">
            {['stats', 'equipment', 'relationships'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'stats' | 'equipment' | 'relationships')}
                className={`py-2 px-4 capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && (
          <div>
            <h3 className="font-semibold mb-3">Skills</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(hero.skills).map(([skill, value]) => (
                <div key={skill} className="flex justify-between">
                  <span className="capitalize">{skill}:</span>
                  <span className="font-medium">{value}/100</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div>
            <h3 className="font-semibold mb-3">Current Equipment</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {(['weapon', 'armor', 'accessory'] as const).map(slot => (
                <div key={slot} className="border rounded-lg p-3">
                  <div className="text-sm text-gray-600 mb-1 capitalize">{slot}</div>
                  {hero.equipment[slot] ? (
                    <div className="text-sm">
                      <div className="font-medium">{hero.equipment[slot]!.name}</div>
                      <div className="text-xs text-gray-500">
                        {hero.equipment[slot]!.rarity}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">None equipped</div>
                  )}
                </div>
              ))}
            </div>

            <h4 className="font-medium mb-2">Available Equipment</h4>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {Object.values(EQUIPMENT).map(equipment => (
                <div key={equipment.id} className="border rounded p-2 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">{equipment.name}</div>
                    <div className="text-xs text-gray-600">{equipment.description}</div>
                    <div className="text-xs text-green-600">{equipment.cost} gold</div>
                  </div>
                  <button
                    onClick={() => handleEquipItem(equipment)}
                    disabled={!canAfford({ gold: equipment.cost })}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Equip
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'relationships' && (
          <div>
            <h3 className="font-semibold mb-3">Relationships</h3>
            {hero.relationships.length > 0 ? (
              <div className="space-y-2">
                {hero.relationships.map(rel => (
                  <div key={rel.heroId} className="border rounded p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Hero {rel.heroId}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        rel.relationshipType === 'friendship' ? 'bg-green-100 text-green-800' :
                        rel.relationshipType === 'rivalry' ? 'bg-red-100 text-red-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                        {rel.relationshipType}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Strength: {rel.strength}/100
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No relationships yet</p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HeroDetailsModal;