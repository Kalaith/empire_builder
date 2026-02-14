import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SaveSlot } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';
import { gameConfig } from '../../data/gameData';

interface SaveLoadMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
}

const SaveLoadMenu: React.FC<SaveLoadMenuProps> = ({ isOpen, onClose, mode }) => {
  const { saveGame, loadGame, getSaveSlots, deleteSaveSlot } = useGameStore();
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [saveName, setSaveName] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSaveSlots(getSaveSlots());
    }
  }, [isOpen, getSaveSlots]);

  if (!isOpen) return null;

  const handleSave = (slotId: number) => {
    const name = saveName.trim() || `Save ${slotId}`;
    if (saveGame(slotId, name)) {
      setSaveSlots(getSaveSlots());
      setSaveName('');
      onClose();
    }
  };

  const handleLoad = (slotId: number) => {
    if (loadGame(slotId)) {
      onClose();
    }
  };

  const handleDelete = (slotId: number) => {
    if (confirmDelete === slotId) {
      if (deleteSaveSlot(slotId)) {
        setSaveSlots(getSaveSlots());
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(slotId);
    }
  };

  const formatDate = (timestamp: number) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      ' ' +
      new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const getEmptySlots = () => {
    const usedSlots = saveSlots.map(slot => slot.id);
    const emptySlots = [];
    for (let i = 1; i <= gameConfig.MAX_SAVE_SLOTS; i++) {
      if (!usedSlots.includes(i)) {
        emptySlots.push(i);
      }
    }
    return emptySlots;
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
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{mode} Game</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            ×
          </button>
        </div>

        {mode === 'save' && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Save Name (optional)
            </label>
            <input
              type="text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Enter a name for this save..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Existing Save Slots */}
        {saveSlots.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {mode === 'save' ? 'Overwrite Existing Save' : 'Load Game'}
            </h3>
            <div className="space-y-3">
              {saveSlots.map(slot => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSlot === slot.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSlot(selectedSlot === slot.id ? null : slot.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">
                        Slot {slot.id}: {slot.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Saved: {formatDate(slot.timestamp)}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>💰{Math.floor(slot.gameState.resources.gold)}</span>
                        <span>🦸{slot.gameState.heroes.length} heroes</span>
                        <span>🏠{slot.gameState.buildings.length} buildings</span>
                        <span>Level {slot.gameState.statistics.highestHeroLevel}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {mode === 'save' && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleSave(slot.id);
                          }}
                          className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                        >
                          Overwrite
                        </button>
                      )}

                      {mode === 'load' && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleLoad(slot.id);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Load
                        </button>
                      )}

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(slot.id);
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          confirmDelete === slot.id
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {confirmDelete === slot.id ? 'Confirm' : 'Delete'}
                      </button>
                    </div>
                  </div>

                  {selectedSlot === slot.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <div>Resources:</div>
                          <div className="text-xs">
                            <div>💰 {Math.floor(slot.gameState.resources.gold)} Gold</div>
                            <div>🔮 {Math.floor(slot.gameState.resources.mana)} Mana</div>
                            <div>📦 {Math.floor(slot.gameState.resources.supplies)} Supplies</div>
                            <div>
                              👥 {slot.gameState.resources.population}/
                              {slot.gameState.resources.maxPopulation} Population
                            </div>
                          </div>
                        </div>
                        <div>
                          <div>Statistics:</div>
                          <div className="text-xs">
                            <div>
                              ⚔️ {slot.gameState.statistics.totalEnemiesDefeated} Enemies Defeated
                            </div>
                            <div>
                              🏗️ {slot.gameState.statistics.totalBuildingsConstructed} Buildings
                              Built
                            </div>
                            <div>
                              📋 {slot.gameState.statistics.totalQuestsCompleted} Quests Completed
                            </div>
                            <div>
                              🏆 {slot.gameState.statistics.achievementsUnlocked} Achievements
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty Slots (for saving) */}
        {mode === 'save' && getEmptySlots().length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Create New Save</h3>
            <div className="grid grid-cols-2 gap-3">
              {getEmptySlots().map(slotId => (
                <button
                  key={slotId}
                  onClick={() => handleSave(slotId)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl text-gray-400 mb-2">💾</div>
                    <div className="text-sm font-medium text-gray-600">Save to Slot {slotId}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No saves message for load mode */}
        {mode === 'load' && saveSlots.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">💾</div>
            <p className="text-lg mb-2">No saved games found</p>
            <p className="text-sm">Start a new game and save your progress!</p>
          </div>
        )}

        {/* No empty slots message for save mode */}
        {mode === 'save' &&
          getEmptySlots().length === 0 &&
          saveSlots.length >= gameConfig.MAX_SAVE_SLOTS && (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
              <p className="text-sm">
                All {gameConfig.MAX_SAVE_SLOTS} save slots are full. Overwrite an existing save or
                delete one to create a new save.
              </p>
            </div>
          )}
      </motion.div>
    </motion.div>
  );
};

export default SaveLoadMenu;
