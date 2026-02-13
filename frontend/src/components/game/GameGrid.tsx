import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { flagTypes } from '../../data/gameData';
import type { GridCell } from '../../types/game';

const GameGrid: React.FC = () => {
  const { grid, gridWidth, gridHeight, placeBuilding, placeFlag, resources } = useGameStore();
  const { selectedBuildingType, selectedFlagType, selectFlagType, cancelSelection, selectEntity, addGameMessage } = useUIStore();

  const handleCellClick = (x: number, y: number) => {
    const cell = grid[y][x];

    if (selectedBuildingType) {
      const building = placeBuilding(selectedBuildingType, x, y);
      if (building) {
        addGameMessage(`Built ${building.name}!`, 'success');
      } else {
        addGameMessage('Cannot build here!', 'error');
      }
    } else if (selectedFlagType) {
      const flag = placeFlag(selectedFlagType, x, y);
      if (flag) {
        addGameMessage(`Placed ${flag.name}!`, 'success');
      } else {
        addGameMessage('Cannot place flag here!', 'error');
      }
    } else {
      // Select entity in cell
      if (cell.building) {
        selectEntity(cell.building, 'building');
      } else if (cell.hero) {
        selectEntity(cell.hero, 'hero');
      } else if (cell.enemy) {
        selectEntity(cell.enemy, 'enemy');
      } else if (cell.flag) {
        selectEntity(cell.flag, 'flag');
      }
    }
  };

  const handleFlagSelect = (type: string) => {
    if (type === 'cancel') {
      cancelSelection();
      addGameMessage('Selection cancelled', 'info');
    } else {
      selectFlagType(type);
      addGameMessage(`Selected ${flagTypes[type].name} - click empty cell to place`, 'info');
    }
  };

  const renderCell = (cell: GridCell, x: number, y: number) => {
    let cellContent = '';
    let cellClass = 'grid-cell w-8 h-8 border border-gray-300 cursor-pointer hover:bg-gray-100 flex items-center justify-center text-sm';

    if (cell.building) {
      cellContent = cell.building.symbol;
      cellClass += ' building bg-blue-100';
    } else if (cell.hero) {
      cellContent = cell.hero.symbol;
      cellClass += ' hero bg-green-100';
    } else if (cell.enemy) {
      cellContent = cell.enemy.symbol;
      cellClass += ' enemy bg-red-100';
    } else if (cell.flag) {
      cellContent = cell.flag.symbol;
      cellClass += ' flag bg-yellow-100';
    }

    return (
      <div
        key={`${x}-${y}`}
        className={cellClass}
        onClick={() => handleCellClick(x, y)}
        title={`(${x}, ${y})`}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <div className="game-area flex-1 space-y-4">
      {/* Flag Controls */}
      <div className="flag-controls bg-white rounded-lg shadow-md p-4">
        <h4 className="text-md font-bold mb-3 text-gray-800">Place Reward Flags</h4>
        <div className="flag-buttons flex gap-2 flex-wrap">
          {Object.entries(flagTypes).map(([type, flag]) => {
            const canAfford = resources.gold >= flag.baseCost;
            const isSelected = selectedFlagType === type;

            return (
              <button
                key={type}
                className={`flag-btn flex items-center gap-2 px-3 py-2 rounded border transition-colors ${
                  isSelected
                    ? 'bg-red-100 border-red-500 text-red-700'
                    : canAfford
                      ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => handleFlagSelect(type)}
                disabled={!canAfford}
              >
                <span className="flag-icon text-lg">{flag.symbol}</span>
                <span className="flag-name text-sm">{flag.name}</span>
                <span className={`flag-cost text-xs ml-1 ${canAfford ? 'text-green-600' : 'text-red-500'}`}>
                  {flag.baseCost}g
                </span>
              </button>
            );
          })}
          <button
            className="flag-btn cancel-btn flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={() => handleFlagSelect('cancel')}
          >
            <span className="flag-icon text-lg">❌</span>
            <span className="flag-name text-sm">Cancel</span>
          </button>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid-container bg-white rounded-lg shadow-md p-4">
        <div
          className="game-grid grid gap-0 border-2 border-gray-400 bg-gray-50 p-2 rounded"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
            gridTemplateRows: `repeat(${gridHeight}, 1fr)`
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => renderCell(cell, x, y))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
