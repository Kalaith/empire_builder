import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  Building,
  Hero,
  Enemy,
  Flag,
  GridCell,
  Resources,
  SaveSlot,
  GameStatistics,
  HeroSkills,
  HeroEquipment,
  Equipment,
  ResourceCost,
  CombatRecord,
  HeroRelationship
} from '../types/game';
import {
  BUILDING_TYPES,
  HERO_CLASSES,
  HERO_SPECIALIZATIONS,
  FLAG_TYPES,
  ENEMY_TYPES,
  SAMPLE_QUESTS,
  SAMPLE_ACHIEVEMENTS,
  GAME_CONFIG
} from '../data/gameData';

interface GameStore extends GameState {
  // Core Actions
  initializeGrid: () => void;
  placeCastle: () => void;
  canPlaceBuilding: (x: number, y: number) => boolean;
  placeBuilding: (type: string, x: number, y: number) => Building | null;
  upgradeBuilding: (buildingId: string) => boolean;
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

  // Enhanced Hero Actions
  levelUpHero: (heroId: string) => boolean;
  assignSpecialization: (heroId: string, specializationId: string) => boolean;
  equipItem: (heroId: string, equipment: Equipment) => boolean;
  updateHeroMorale: (heroId: string, change: number) => void;
  addHeroRelationship: (heroId1: string, heroId2: string, type: 'friendship' | 'rivalry' | 'romance') => void;
  addCombatRecord: (heroId: string, record: CombatRecord) => void;

  // Resource Management
  canAfford: (cost: ResourceCost) => boolean;
  spendResources: (cost: ResourceCost) => boolean;
  addResources: (resources: Partial<Resources>) => void;

  // Quest System
  startQuest: (questId: string, heroId?: string) => boolean;
  completeQuest: (questId: string) => boolean;
  updateQuestProgress: (questId: string, objectiveId: string, progress: number) => void;

  // Achievement System
  checkAchievements: () => void;
  unlockAchievement: (achievementId: string) => boolean;
  updateAchievementProgress: (achievementId: string, progress: Record<string, number>) => void;

  // Save/Load System
  saveGame: (slotId: number, name?: string) => boolean;
  loadGame: (slotId: number) => boolean;
  getSaveSlots: () => SaveSlot[];
  deleteSaveSlot: (slotId: number) => boolean;

  // Game State Management
  pauseGame: () => void;
  resumeGame: () => void;
  updateStatistics: (updates: Partial<GameStatistics>) => void;
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

const createInitialHeroSkills = (): HeroSkills => ({
  combat: 10,
  exploration: 10,
  leadership: 10,
  magic: 10,
  stealth: 10,
  ranged: 10,
  defense: 10
});

const createInitialHeroEquipment = (): HeroEquipment => ({
  weapon: undefined,
  armor: undefined,
  accessory: undefined
});

const createInitialStatistics = (): GameStatistics => ({
  totalPlayTime: 0,
  totalGoldEarned: 0,
  totalHeroesRecruited: 0,
  totalEnemiesDefeated: 0,
  totalBuildingsConstructed: 0,
  totalQuestsCompleted: 0,
  highestHeroLevel: 1,
  largestPopulation: 0,
  sessionsPlayed: 1,
  achievementsUnlocked: 0
});

const createInitialState = (): GameState => ({
  resources: { ...GAME_CONFIG.STARTING_RESOURCES },
  gridWidth: GAME_CONFIG.GRID_WIDTH,
  gridHeight: GAME_CONFIG.GRID_HEIGHT,
  grid: createInitialGrid(),
  buildings: [],
  heroes: [],
  enemies: [],
  flags: [],
  quests: [...SAMPLE_QUESTS],
  achievements: [...SAMPLE_ACHIEVEMENTS],
  activeEvents: [],
  gameTime: 0,
  isGameOver: false,
  isPaused: false,
  difficulty: 'normal',
  nextHeroId: 1,
  nextEnemyId: 1,
  nextQuestId: SAMPLE_QUESTS.length + 1,
  statistics: createInitialStatistics()
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

      canAfford: (cost: ResourceCost) => {
        const state = get();
        const { resources } = state;
        return (
          (!cost.gold || resources.gold >= cost.gold) &&
          (!cost.mana || resources.mana >= cost.mana) &&
          (!cost.supplies || resources.supplies >= cost.supplies) &&
          (!cost.population || resources.maxPopulation >= resources.population + cost.population)
        );
      },

      spendResources: (cost: ResourceCost) => {
        const state = get();
        if (!state.canAfford(cost)) return false;

        const newResources = { ...state.resources };
        if (cost.gold) newResources.gold -= cost.gold;
        if (cost.mana) newResources.mana -= cost.mana;
        if (cost.supplies) newResources.supplies -= cost.supplies;
        if (cost.population) newResources.population += cost.population;

        set({ resources: newResources });
        return true;
      },

      addResources: (resources: Partial<Resources>) => {
        const state = get();
        const newResources = { ...state.resources };

        if (resources.gold) newResources.gold += resources.gold;
        if (resources.mana) newResources.mana += resources.mana;
        if (resources.supplies) newResources.supplies += resources.supplies;
        if (resources.population) {
          newResources.population = Math.min(
            newResources.population + resources.population,
            newResources.maxPopulation
          );
        }
        if (resources.maxPopulation) newResources.maxPopulation += resources.maxPopulation;

        set({ resources: newResources });
      },

      placeBuilding: (type: string, x: number, y: number) => {
        const state = get();
        if (!state.canPlaceBuilding(x, y)) return null;

        const buildingData = BUILDING_TYPES[type];
        if (!state.canAfford(buildingData.cost)) return null;

        const building: Building = {
          id: `building_${Date.now()}`,
          type,
          x,
          y,
          level: 1,
          name: buildingData.name,
          cost: buildingData.cost,
          production: buildingData.production,
          isProducing: false,
          productionCooldown: 0,
          color: buildingData.color,
          symbol: buildingData.symbol,
          healthPoints: 100,
          maxHealthPoints: 100
        };

        state.spendResources(buildingData.cost);

        const newBuildings = [...state.buildings, building];
        const newGrid = [...state.grid];
        newGrid[y][x].building = building;

        set({
          buildings: newBuildings,
          grid: newGrid
        });

        // Update statistics
        state.updateStatistics({ totalBuildingsConstructed: state.statistics.totalBuildingsConstructed + 1 });

        return building;
      },

      upgradeBuilding: (buildingId: string) => {
        const state = get();
        const building = state.buildings.find(b => b.id === buildingId);
        if (!building) return false;

        const buildingType = BUILDING_TYPES[building.type];
        if (!buildingType || building.level >= buildingType.maxLevel) return false;

        const upgrade = buildingType.upgrades.find(u => u.level === building.level + 1);
        if (!upgrade || !state.canAfford(upgrade.cost)) return false;

        state.spendResources(upgrade.cost);

        const updatedBuildings = state.buildings.map(b => {
          if (b.id === buildingId) {
            const newProduction = { ...b.production };
            Object.keys(upgrade.benefits).forEach(key => {
              if (upgrade.benefits[key as keyof typeof upgrade.benefits]) {
                newProduction[key as keyof typeof newProduction] =
                  (newProduction[key as keyof typeof newProduction] || 0) +
                  upgrade.benefits[key as keyof typeof upgrade.benefits]!;
              }
            });

            return {
              ...b,
              level: b.level + 1,
              production: newProduction
            };
          }
          return b;
        });

        const newGrid = [...state.grid];
        const upgradedBuilding = updatedBuildings.find(b => b.id === buildingId)!;
        newGrid[building.y][building.x].building = upgradedBuilding;

        set({
          buildings: updatedBuildings,
          grid: newGrid
        });

        return true;
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
          baseHealth: heroClass.baseHealth,
          maxHealth: heroClass.baseHealth,
          health: heroClass.baseHealth,
          baseDamage: heroClass.baseDamage,
          damage: heroClass.baseDamage,
          baseSpeed: heroClass.baseSpeed,
          speed: heroClass.baseSpeed,
          gold: 0,
          level: 1,
          experience: 0,
          experienceToNext: GAME_CONFIG.BASE_EXPERIENCE,
          equipment: createInitialHeroEquipment(),
          skills: createInitialHeroSkills(),
          specialization: undefined,
          morale: 100,
          relationships: [],
          moveCooldown: 0,
          lastAction: 'spawned',
          combatHistory: [],
          questsCompleted: 0,
          heroName: `${heroClass.name} ${state.nextHeroId}`,
          className: heroClass.name,
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

        // Update statistics
        state.updateStatistics({ totalHeroesRecruited: state.statistics.totalHeroesRecruited + 1 });

        return hero;
      },

      levelUpHero: (heroId: string) => {
        const state = get();
        const hero = state.heroes.find(h => h.id === heroId);
        if (!hero || hero.experience < hero.experienceToNext) return false;

        const newLevel = hero.level + 1;
        const statIncrease = Math.floor(newLevel * GAME_CONFIG.LEVEL_MULTIPLIER);
        const newExperienceToNext = Math.floor(hero.experienceToNext * GAME_CONFIG.LEVEL_MULTIPLIER);

        const updatedHeroes = state.heroes.map(h => {
          if (h.id === heroId) {
            return {
              ...h,
              level: newLevel,
              experience: h.experience - h.experienceToNext,
              experienceToNext: newExperienceToNext,
              maxHealth: h.maxHealth + statIncrease,
              health: h.health + statIncrease,
              damage: h.damage + Math.floor(statIncrease * 0.8),
              speed: h.speed + Math.floor(statIncrease * 0.3)
            };
          }
          return h;
        });

        set({ heroes: updatedHeroes });

        // Update statistics
        const highestLevel = Math.max(...updatedHeroes.map(h => h.level));
        if (highestLevel > state.statistics.highestHeroLevel) {
          state.updateStatistics({ highestHeroLevel: highestLevel });
        }

        return true;
      },

      assignSpecialization: (heroId: string, specializationId: string) => {
        const state = get();
        const hero = state.heroes.find(h => h.id === heroId);
        const specialization = HERO_SPECIALIZATIONS[specializationId];

        if (!hero || !specialization || hero.level < specialization.unlockLevel || hero.specialization) {
          return false;
        }

        const updatedHeroes = state.heroes.map(h => {
          if (h.id === heroId) {
            return {
              ...h,
              specialization,
              maxHealth: h.maxHealth + specialization.healthBonus,
              health: h.health + specialization.healthBonus,
              damage: h.damage + specialization.damageBonus,
              speed: h.speed + specialization.speedBonus
            };
          }
          return h;
        });

        set({ heroes: updatedHeroes });
        return true;
      },

      equipItem: (heroId: string, equipment: Equipment) => {
        const state = get();
        const hero = state.heroes.find(h => h.id === heroId);
        if (!hero || !state.canAfford({ gold: equipment.cost })) return false;

        state.spendResources({ gold: equipment.cost });

        const updatedHeroes = state.heroes.map(h => {
          if (h.id === heroId) {
            const oldEquipment = h.equipment[equipment.type];
            const newEquipment = { ...h.equipment };
            newEquipment[equipment.type] = equipment;

            // Calculate stat changes
            let healthChange = equipment.healthBonus;
            let damageChange = equipment.damageBonus;
            let speedChange = equipment.speedBonus;

            if (oldEquipment) {
              healthChange -= oldEquipment.healthBonus;
              damageChange -= oldEquipment.damageBonus;
              speedChange -= oldEquipment.speedBonus;
            }

            return {
              ...h,
              equipment: newEquipment,
              maxHealth: h.maxHealth + healthChange,
              health: h.health + healthChange,
              damage: h.damage + damageChange,
              speed: h.speed + speedChange
            };
          }
          return h;
        });

        set({ heroes: updatedHeroes });
        return true;
      },

      updateHeroMorale: (heroId: string, change: number) => {
        const state = get();
        const updatedHeroes = state.heroes.map(h => {
          if (h.id === heroId) {
            return {
              ...h,
              morale: Math.max(0, Math.min(100, h.morale + change))
            };
          }
          return h;
        });
        set({ heroes: updatedHeroes });
      },

      addHeroRelationship: (heroId1: string, heroId2: string, type: string) => {
        const state = get();
        const updatedHeroes = state.heroes.map(h => {
          if (h.id === heroId1) {
            const existingRelationship = h.relationships.find(r => r.heroId === heroId2);
            if (existingRelationship) return h;

            const relationship: HeroRelationship = {
              heroId: heroId2,
              relationshipType: type,
              strength: 10,
              history: [`Met ${heroId2}`]
            };
            return {
              ...h,
              relationships: [...h.relationships, relationship]
            };
          }
          return h;
        });
        set({ heroes: updatedHeroes });
      },

      addCombatRecord: (heroId: string, record: CombatRecord) => {
        const state = get();
        const updatedHeroes = state.heroes.map(h => {
          if (h.id === heroId) {
            return {
              ...h,
              combatHistory: [...h.combatHistory, record],
              experience: h.experience + record.experienceGained
            };
          }
          return h;
        });
        set({ heroes: updatedHeroes });

        // Check for level up
        const hero = updatedHeroes.find(h => h.id === heroId);
        if (hero && hero.experience >= hero.experienceToNext) {
          state.levelUpHero(heroId);
        }
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
        const totalProduction = state.buildings.reduce(
          (totals, building) => {
            if (building.production.gold) totals.gold += building.production.gold;
            if (building.production.mana) totals.mana += building.production.mana;
            if (building.production.supplies) totals.supplies += building.production.supplies;
            return totals;
          },
          { gold: 0, mana: 0, supplies: 0 }
        );

        state.addResources(totalProduction);
        state.updateStatistics({ totalGoldEarned: state.statistics.totalGoldEarned + totalProduction.gold });
      },

      // Quest System Methods
      startQuest: (questId: string, heroId?: string) => {
        const state = get();
        const quest = state.quests.find(q => q.id === questId);
        if (!quest || quest.isActive || quest.isCompleted) return false;

        const updatedQuests = state.quests.map(q => {
          if (q.id === questId) {
            return {
              ...q,
              isActive: true,
              assignedHeroId: heroId
            };
          }
          return q;
        });

        set({ quests: updatedQuests });
        return true;
      },

      completeQuest: (questId: string) => {
        const state = get();
        const quest = state.quests.find(q => q.id === questId);
        if (!quest || !quest.isActive || quest.isCompleted) return false;

        // Check if all objectives are completed
        const allObjectivesCompleted = quest.objectives.every(obj => obj.isCompleted);
        if (!allObjectivesCompleted) return false;

        // Award resources
        state.addResources(quest.rewards);

        // Mark quest as completed
        const updatedQuests = state.quests.map(q => {
          if (q.id === questId) {
            return {
              ...q,
              isActive: false,
              isCompleted: true
            };
          }
          return q;
        });

        set({ quests: updatedQuests });

        // Update statistics
        state.updateStatistics({ totalQuestsCompleted: state.statistics.totalQuestsCompleted + 1 });

        return true;
      },

      updateQuestProgress: (questId: string, objectiveId: string, progress: number) => {
        const state = get();
        const updatedQuests = state.quests.map(q => {
          if (q.id === questId && q.isActive) {
            const updatedObjectives = q.objectives.map(obj => {
              if (obj.id === objectiveId) {
                const newCurrent = Math.min(obj.target, obj.current + progress);
                return {
                  ...obj,
                  current: newCurrent,
                  isCompleted: newCurrent >= obj.target
                };
              }
              return obj;
            });

            return {
              ...q,
              objectives: updatedObjectives
            };
          }
          return q;
        });

        set({ quests: updatedQuests });

        // Check if quest can be completed
        const quest = updatedQuests.find(q => q.id === questId);
        if (quest && quest.objectives.every(obj => obj.isCompleted)) {
          state.completeQuest(questId);
        }
      },

      // Achievement System Methods
      checkAchievements: () => {
        const state = get();
        const unlockedAchievements: string[] = [];

        const updatedAchievements = state.achievements.map(achievement => {
          if (achievement.isUnlocked) return achievement;

          const requirementsMet = Object.keys(achievement.requirements).every(key => {
            const requiredValue = achievement.requirements[key];
            const currentValue = achievement.progress[key] || 0;
            return currentValue >= requiredValue;
          });

          if (requirementsMet) {
            unlockedAchievements.push(achievement.id);
            state.addResources(achievement.rewards);
            return { ...achievement, isUnlocked: true };
          }

          return achievement;
        });

        if (unlockedAchievements.length > 0) {
          set({ achievements: updatedAchievements });
          state.updateStatistics({
            achievementsUnlocked: state.statistics.achievementsUnlocked + unlockedAchievements.length
          });
        }
      },

      unlockAchievement: (achievementId: string) => {
        const state = get();
        const achievement = state.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.isUnlocked) return false;

        const updatedAchievements = state.achievements.map(a => {
          if (a.id === achievementId) {
            return { ...a, isUnlocked: true };
          }
          return a;
        });

        set({ achievements: updatedAchievements });
        state.addResources(achievement.rewards);
        state.updateStatistics({ achievementsUnlocked: state.statistics.achievementsUnlocked + 1 });

        return true;
      },

      updateAchievementProgress: (achievementId: string, progress: Record<string, number>) => {
        const state = get();
        const updatedAchievements = state.achievements.map(achievement => {
          if (achievement.id === achievementId && !achievement.isUnlocked) {
            return {
              ...achievement,
              progress: { ...achievement.progress, ...progress }
            };
          }
          return achievement;
        });

        set({ achievements: updatedAchievements });
        state.checkAchievements();
      },

      // Save/Load System Methods
      saveGame: (slotId: number, name?: string) => {
        const state = get();
        try {
          const saveData: SaveSlot = {
            id: slotId,
            name: name || `Save ${slotId}`,
            timestamp: Date.now(),
            gameState: {
              resources: state.resources,
              gridWidth: state.gridWidth,
              gridHeight: state.gridHeight,
              grid: state.grid,
              buildings: state.buildings,
              heroes: state.heroes,
              enemies: state.enemies,
              flags: state.flags,
              quests: state.quests,
              achievements: state.achievements,
              activeEvents: state.activeEvents,
              gameTime: state.gameTime,
              isGameOver: state.isGameOver,
              isPaused: state.isPaused,
              difficulty: state.difficulty,
              nextHeroId: state.nextHeroId,
              nextEnemyId: state.nextEnemyId,
              nextQuestId: state.nextQuestId,
              statistics: state.statistics
            }
          };

          localStorage.setItem(`empire_builder_save_${slotId}`, JSON.stringify(saveData));
          return true;
        } catch (error) {
          console.error('Failed to save game:', error);
          return false;
        }
      },

      loadGame: (slotId: number) => {
        try {
          const saveDataString = localStorage.getItem(`empire_builder_save_${slotId}`);
          if (!saveDataString) return false;

          const saveData: SaveSlot = JSON.parse(saveDataString);
          set(saveData.gameState);
          return true;
        } catch (error) {
          console.error('Failed to load game:', error);
          return false;
        }
      },

      getSaveSlots: () => {
        const slots: SaveSlot[] = [];
        for (let i = 1; i <= GAME_CONFIG.MAX_SAVE_SLOTS; i++) {
          try {
            const saveDataString = localStorage.getItem(`empire_builder_save_${i}`);
            if (saveDataString) {
              const saveData: SaveSlot = JSON.parse(saveDataString);
              slots.push(saveData);
            }
          } catch (error) {
            console.error(`Failed to load save slot ${i}:`, error);
          }
        }
        return slots;
      },

      deleteSaveSlot: (slotId: number) => {
        try {
          localStorage.removeItem(`empire_builder_save_${slotId}`);
          return true;
        } catch (error) {
          console.error('Failed to delete save slot:', error);
          return false;
        }
      },

      // Game State Management Methods
      pauseGame: () => {
        set({ isPaused: true });
      },

      resumeGame: () => {
        set({ isPaused: false });
      },

      updateStatistics: (updates: Partial<GameStatistics>) => {
        const state = get();
        set({
          statistics: { ...state.statistics, ...updates }
        });
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
