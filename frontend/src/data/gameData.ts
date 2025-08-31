import type { BuildingType, HeroClass, FlagType, EnemyType } from '../types/game';

export const BUILDING_TYPES: Record<string, BuildingType> = {
  castle: { name: "Castle", cost: 0, income: 10, color: "#8B4513", symbol: "🏰" },
  warriorGuild: { name: "Warrior Guild", cost: 100, income: 5, color: "#FF6B6B", symbol: "⚔️" },
  rangerGuild: { name: "Ranger Guild", cost: 120, income: 5, color: "#4ECDC4", symbol: "🏹" },
  wizardGuild: { name: "Wizard Guild", cost: 150, income: 5, color: "#45B7D1", symbol: "🔮" },
  rogueGuild: { name: "Rogue Guild", cost: 80, income: 5, color: "#96CEB4", symbol: "🗡️" },
  marketplace: { name: "Marketplace", cost: 60, income: 15, color: "#FFEAA7", symbol: "🏪" },
  blacksmith: { name: "Blacksmith", cost: 80, income: 8, color: "#636E72", symbol: "🔨" },
  inn: { name: "Inn", cost: 50, income: 12, color: "#FD79A8", symbol: "🍺" },
  guardTower: { name: "Guard Tower", cost: 40, income: 2, color: "#2D3436", symbol: "🗼" }
};

export const HERO_CLASSES: Record<string, HeroClass> = {
  warrior: { name: "Warrior", health: 100, damage: 20, speed: 1, color: "#FF6B6B", symbol: "🛡️", preferences: ["attack", "defend"] },
  ranger: { name: "Ranger", health: 80, damage: 15, speed: 2, color: "#4ECDC4", symbol: "🏹", preferences: ["explore", "attack"] },
  wizard: { name: "Wizard", health: 60, damage: 25, speed: 1, color: "#45B7D1", symbol: "🔮", preferences: ["attack", "explore"] },
  rogue: { name: "Rogue", health: 70, damage: 18, speed: 2, color: "#96CEB4", symbol: "🗡️", preferences: ["gold", "explore"] }
};

export const FLAG_TYPES: Record<string, FlagType> = {
  attack: { name: "Attack Flag", color: "#FF0000", symbol: "⚔️", baseCost: 50 },
  explore: { name: "Explore Flag", color: "#00FF00", symbol: "🔍", baseCost: 30 },
  defend: { name: "Defend Flag", color: "#0000FF", symbol: "🛡️", baseCost: 40 }
};

export const ENEMY_TYPES: Record<string, EnemyType> = {
  goblin: { name: "Goblin", health: 40, damage: 8, reward: 20, color: "#228B22", symbol: "👹" },
  orc: { name: "Orc", health: 60, damage: 12, reward: 35, color: "#8B0000", symbol: "👹" },
  troll: { name: "Troll", health: 120, damage: 25, reward: 80, color: "#4B0082", symbol: "👹" }
};

// Game configuration constants
export const GAME_CONFIG = {
  GRID_WIDTH: 20,
  GRID_HEIGHT: 15,
  STARTING_GOLD: 500,
  INCOME_INTERVAL: 1000, // ms
  ENEMY_SPAWN_INTERVAL: 5000, // ms
  GAME_LOOP_INTERVAL: 1000, // ms
  EXPERIENCE_MULTIPLIER: 100,
  LEVEL_MULTIPLIER: 1.5,
  BASE_EXPERIENCE: 1000
} as const;
