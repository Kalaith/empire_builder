import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Building, Hero, Enemy, Flag, GridCell } from '../types/game';
import { BUILDING_TYPES, HERO_CLASSES, FLAG_TYPES, ENEMY_TYPES, GAME_CONFIG } from '../data/gameData';

interface GameStore extends GameState {
  // Actions
  initializeGrid: () => void;
  placeCastle: () => void;
  canPlaceBuilding: (x: number, y: number) => boolean;
  placeBuilding: (type: string, x: number, y: number) => Building | null;
  spawnHero: (guildType: string) => Hero | null;
  spawnEnemy: () => Enemy | null;
  placeFlag: (type: string, x: number, y: number) => Flag | null;
  updateHeroPosition: (hero: Hero) => void;
  updateEnemyPosition: (enemy: Enemy) => void;
  removeFlag: (flag: Flag) => void;
  removeEnemy: (enemy: Enemy) => void;
  removeHero: (hero: Hero) => void;
  collectIncome: () => void;
  isGameRunning: () => boolean;
  restartGame: () => void;
}

const createInitialGrid = (): GridCell[][] => {
  const grid: GridCell[][] = [];
  for (let y = 0; y < GAME_CONFIG.GRID_HEIGHT; y++) {
    grid[y] = [];
    for (let x = 0; x < GAME_CONFIG.GRID_WIDTH; x++) {
      grid[y][x] = {};
    }
  }
  return grid;
};

const createInitialState = (): GameState => ({
  gold: GAME_CONFIG.STARTING_GOLD,
  gridWidth: GAME_CONFIG.GRID_WIDTH,
  gridHeight: GAME_CONFIG.GRID_HEIGHT,
  grid: createInitialGrid(),
  buildings: [],
  heroes: [],
  enemies: [],
  flags: [],
  gameTime: 0,
  isGameOver: false,
  nextHeroId: 1,
  nextEnemyId: 1,
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      initializeGrid: () => {
        set({ grid: createInitialGrid() });
      },

      placeCastle: () => {
        const state = get();
        const centerX = Math.floor(state.gridWidth / 2);
        const centerY = Math.floor(state.gridHeight / 2);

        const castle: Building = {
          id: 'castle',
          type: 'castle',
          x: centerX,
          y: centerY,
          ...BUILDING_TYPES.castle
        };

        const newBuildings = [...state.buildings, castle];
        const newGrid = [...state.grid];
        newGrid[centerY][centerX].building = castle;

        set({
          buildings: newBuildings,
          grid: newGrid
        });
      },

      canPlaceBuilding: (x: number, y: number) => {
        const state = get();
        return x >= 0 && x < state.gridWidth &&
               y >= 0 && y < state.gridHeight &&
               !state.grid[y][x].building;
      },

      placeBuilding: (type: string, x: number, y: number) => {
        const state = get();
        if (!state.canPlaceBuilding(x, y)) return null;

        const buildingData = BUILDING_TYPES[type];
        if (state.gold < buildingData.cost) return null;

        const building: Building = {
          id: `building_${Date.now()}`,
          type,
          x,
          y,
          ...buildingData
        };

        const newBuildings = [...state.buildings, building];
        const newGrid = [...state.grid];
        newGrid[y][x].building = building;

        set({
          buildings: newBuildings,
          grid: newGrid,
          gold: state.gold - buildingData.cost
        });

        return building;
      },

      spawnHero: (guildType: string) => {
        const state = get();
        const heroType = guildType.replace('Guild', '').toLowerCase();
        const guild = state.buildings.find(b => b.type === guildType);
        if (!guild || !HERO_CLASSES[heroType]) return null;

        const heroClass = HERO_CLASSES[heroType];
        const hero: Hero = {
          id: `hero_${state.nextHeroId}`,
          type: heroType,
          x: guild.x,
          y: guild.y,
          targetX: guild.x,
          targetY: guild.y,
          maxHealth: heroClass.health,
          health: heroClass.health,
          damage: heroClass.damage,
          gold: 0,
          level: 1,
          experience: 0,
          equipment: 0,
          moveCooldown: 0,
          lastAction: 'spawned',
          name: heroClass.name,
          symbol: heroClass.symbol,
          preferences: [...heroClass.preferences]
        };

        const newHeroes = [...state.heroes, hero];
        const newGrid = [...state.grid];
        newGrid[hero.y][hero.x].hero = hero;

        set({
          heroes: newHeroes,
          grid: newGrid,
          nextHeroId: state.nextHeroId + 1
        });

        return hero;
      },

      spawnEnemy: () => {
        const state = get();
        const enemyTypes = Object.keys(ENEMY_TYPES);
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

        // Spawn at random edge
        let x: number, y: number;
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
          case 0: // top
            x = Math.floor(Math.random() * state.gridWidth);
            y = 0;
            break;
          case 1: // right
            x = state.gridWidth - 1;
            y = Math.floor(Math.random() * state.gridHeight);
            break;
          case 2: // bottom
            x = Math.floor(Math.random() * state.gridWidth);
            y = state.gridHeight - 1;
            break;
          default: // left
            x = 0;
            y = Math.floor(Math.random() * state.gridHeight);
        }

        if (state.grid[y][x].building || state.grid[y][x].enemy) return null;

        const enemyData = ENEMY_TYPES[type];
        const enemy: Enemy = {
          id: `enemy_${state.nextEnemyId}`,
          type,
          x,
          y,
          targetX: x,
          targetY: y,
          maxHealth: enemyData.health,
          health: enemyData.health,
          damage: enemyData.damage,
          reward: enemyData.reward,
          moveCooldown: 0,
          name: enemyData.name,
          symbol: enemyData.symbol
        };

        const newEnemies = [...state.enemies, enemy];
        const newGrid = [...state.grid];
        newGrid[y][x].enemy = enemy;

        set({
          enemies: newEnemies,
          grid: newGrid,
          nextEnemyId: state.nextEnemyId + 1
        });

        return enemy;
      },

      placeFlag: (type: string, x: number, y: number) => {
        const state = get();
        if (x < 0 || x >= state.gridWidth || y < 0 || y >= state.gridHeight) return null;
        if (state.gold < FLAG_TYPES[type].baseCost) return null;
        if (state.grid[y][x].flag || state.grid[y][x].building) return null;

        const flagData = FLAG_TYPES[type];
        const flag: Flag = {
          id: `flag_${Date.now()}`,
          type,
          x,
          y,
          reward: flagData.baseCost,
          name: flagData.name,
          symbol: flagData.symbol,
          baseCost: flagData.baseCost
        };

        const newFlags = [...state.flags, flag];
        const newGrid = [...state.grid];
        newGrid[y][x].flag = flag;

        set({
          flags: newFlags,
          grid: newGrid,
          gold: state.gold - flagData.baseCost
        });

        return flag;
      },

      updateHeroPosition: (hero: Hero) => {
        const state = get();
        const newGrid = [...state.grid];

        // Clear old position
        for (let y = 0; y < state.gridHeight; y++) {
          for (let x = 0; x < state.gridWidth; x++) {
            if (newGrid[y][x].hero?.id === hero.id) {
              newGrid[y][x].hero = undefined;
            }
          }
        }

        // Set new position
        newGrid[hero.y][hero.x].hero = hero;
        set({ grid: newGrid });
      },

      updateEnemyPosition: (enemy: Enemy) => {
        const state = get();
        const newGrid = [...state.grid];

        // Clear old position
        for (let y = 0; y < state.gridHeight; y++) {
          for (let x = 0; x < state.gridWidth; x++) {
            if (newGrid[y][x].enemy?.id === enemy.id) {
              newGrid[y][x].enemy = undefined;
            }
          }
        }

        // Set new position
        newGrid[enemy.y][enemy.x].enemy = enemy;
        set({ grid: newGrid });
      },

      removeFlag: (flag: Flag) => {
        const state = get();
        const newFlags = state.flags.filter(f => f.id !== flag.id);
        const newGrid = [...state.grid];
        newGrid[flag.y][flag.x].flag = undefined;

        set({
          flags: newFlags,
          grid: newGrid
        });
      },

      removeEnemy: (enemy: Enemy) => {
        const state = get();
        const newEnemies = state.enemies.filter(e => e.id !== enemy.id);
        const newGrid = [...state.grid];
        newGrid[enemy.y][enemy.x].enemy = undefined;

        set({
          enemies: newEnemies,
          grid: newGrid
        });
      },

      removeHero: (hero: Hero) => {
        const state = get();
        const newHeroes = state.heroes.filter(h => h.id !== hero.id);
        const newGrid = [...state.grid];
        newGrid[hero.y][hero.x].hero = undefined;

        set({
          heroes: newHeroes,
          grid: newGrid
        });
      },

      collectIncome: () => {
        const state = get();
        const totalIncome = state.buildings.reduce((sum, building) => sum + building.income, 0);
        set({ gold: state.gold + totalIncome });
      },

      isGameRunning: () => {
        const state = get();
        return !state.isGameOver;
      },

      restartGame: () => {
        set(createInitialState());
        get().initializeGrid();
        get().placeCastle();
      },
    }),
    {
      name: 'empire-builder-game',
      partialize: (state) => ({
        gold: state.gold,
        buildings: state.buildings,
        heroes: state.heroes,
        flags: state.flags,
        gameTime: state.gameTime,
        nextHeroId: state.nextHeroId,
        nextEnemyId: state.nextEnemyId,
      }),
    }
  )
);
