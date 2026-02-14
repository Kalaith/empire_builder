import React from 'react';
import { motion } from 'framer-motion';
import type { Building, ResourceCost, ResourceProduction } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';
import { buildingTypes } from '../../data/gameData';

interface BuildingUpgradeModalProps {
  building: Building;
  isOpen: boolean;
  onClose: () => void;
}

const BuildingUpgradeModal: React.FC<BuildingUpgradeModalProps> = ({
  building,
  isOpen,
  onClose,
}) => {
  const { upgradeBuilding, canAfford } = useGameStore();

  if (!isOpen) return null;

  const buildingType = buildingTypes[building.type];
  if (!buildingType) return null;

  const nextUpgrade = buildingType.upgrades.find(u => u.level === building.level + 1);
  const canUpgrade = building.level < buildingType.maxLevel;

  const handleUpgrade = () => {
    if (nextUpgrade && canAfford(nextUpgrade.cost)) {
      upgradeBuilding(building.id);
    }
  };

  const formatResourceCost = (cost: ResourceCost) => {
    const parts = [];
    if (cost.gold) parts.push(`💰${cost.gold}`);
    if (cost.mana) parts.push(`🔮${cost.mana}`);
    if (cost.supplies) parts.push(`📦${cost.supplies}`);
    if (cost.population) parts.push(`👥${cost.population}`);
    return parts.join(' ');
  };

  const formatResourceProduction = (production: ResourceProduction) => {
    const parts = [];
    if (production.gold) parts.push(`💰+${production.gold}/min`);
    if (production.mana) parts.push(`🔮+${production.mana}/min`);
    if (production.supplies) parts.push(`📦+${production.supplies}/min`);
    if (production.population)
      parts.push(`👥${production.population > 0 ? '+' : ''}${production.population}`);
    return parts.join(' ') || 'No production';
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
        className="bg-white rounded-lg p-6 max-w-md w-full m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {building.name} - Level {building.level}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            ×
          </button>
        </div>

        {/* Building Icon and Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl bg-gray-100 p-4 rounded-lg">{building.symbol}</div>
          <div>
            <div className="text-sm text-gray-600 mb-1">{buildingType.description}</div>
            <div className="text-sm text-gray-600">
              Category: <span className="capitalize">{buildingType.category}</span>
            </div>
            <div className="text-sm text-gray-600">
              Health: {building.healthPoints}/{building.maxHealthPoints}
            </div>
          </div>
        </div>

        {/* Current Production */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800">Current Production</h3>
          <div className="text-sm text-gray-700">
            {formatResourceProduction(building.production)}
          </div>
        </div>

        {/* Upgrade Information */}
        {canUpgrade && nextUpgrade ? (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Available Upgrade</h3>
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-medium text-blue-800 mb-2">
                Level {nextUpgrade.level}: {nextUpgrade.name}
              </h4>
              <p className="text-sm text-blue-700 mb-3">{nextUpgrade.description}</p>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Cost: </span>
                  <span className="text-red-600">{formatResourceCost(nextUpgrade.cost)}</span>
                </div>
                <div>
                  <span className="font-medium">Benefits: </span>
                  <span className="text-green-600">
                    {formatResourceProduction(nextUpgrade.benefits)}
                  </span>
                </div>
                {nextUpgrade.requirements && nextUpgrade.requirements.length > 0 && (
                  <div>
                    <span className="font-medium">Requirements: </span>
                    <span className="text-gray-600">{nextUpgrade.requirements.join(', ')}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpgrade}
                disabled={!canAfford(nextUpgrade.cost)}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-medium ${
                  canAfford(nextUpgrade.cost)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canAfford(nextUpgrade.cost) ? 'Upgrade Building' : 'Insufficient Resources'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Max Level Reached</h3>
            <p className="text-sm text-yellow-700">
              This building has reached its maximum upgrade level of {buildingType.maxLevel}.
            </p>
          </div>
        )}

        {/* All Available Upgrades */}
        {buildingType.upgrades.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">All Upgrades</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {buildingType.upgrades.map(upgrade => (
                <div
                  key={upgrade.level}
                  className={`border rounded p-3 ${
                    upgrade.level <= building.level
                      ? 'bg-green-50 border-green-200'
                      : upgrade.level === building.level + 1
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">
                      Level {upgrade.level}: {upgrade.name}
                    </span>
                    {upgrade.level <= building.level && (
                      <span className="text-green-600 text-xs">✓ Unlocked</span>
                    )}
                    {upgrade.level === building.level + 1 && (
                      <span className="text-blue-600 text-xs">📋 Available</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{upgrade.description}</p>
                  <div className="text-xs text-gray-500">
                    <span>Cost: {formatResourceCost(upgrade.cost)}</span>
                    {Object.keys(upgrade.benefits).length > 0 && (
                      <span className="ml-2">
                        Benefits: {formatResourceProduction(upgrade.benefits)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BuildingUpgradeModal;
