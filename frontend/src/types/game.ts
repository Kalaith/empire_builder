// Game data types
export interface BuildingType {
  name: string;
  cost: number;
  income: number;
  color: string;
  symbol: string;
}

export interface HeroClass {
  name: string;
  health: number;
  damage: number;
  speed: number;
  color: string;
  symbol: string;
  preferences: string[];
}

export interface FlagType {
  name: string;
  color: string;
  symbol: string;
  baseCost: number;
}

export interface EnemyType {
  name: string;
  health: number;
  damage: number;
  reward: number;
  color: string;
  symbol: string;
}

// Game entity types
export interface Building {
  id: string;
  type: string;
  x: number;
  y: number;
  name: string;
  cost: number;
  income: number;
  color: string;
  symbol: string;
}

export interface Hero {
  id: string;
  type: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  maxHealth: number;
  health: number;
  damage: number;
  gold: number;
  level: number;
  experience: number;
  equipment: number;
  moveCooldown: number;
  lastAction: string;
  name: string;
  symbol: string;
  preferences: string[];
}

export interface Enemy {
  id: string;
  type: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  maxHealth: number;
  health: number;
  damage: number;
  reward: number;
  moveCooldown: number;
  name: string;
  symbol: string;
}

export interface Flag {
  id: string;
  type: string;
  x: number;
  y: number;
  reward: number;
  name: string;
  symbol: string;
  baseCost: number;
}

export interface GridCell {
  building?: Building;
  hero?: Hero;
  enemy?: Enemy;
  flag?: Flag;
}

// Game state type
export interface GameState {
  gold: number;
  gridWidth: number;
  gridHeight: number;
  grid: GridCell[][];
  buildings: Building[];
  heroes: Hero[];
  enemies: Enemy[];
  flags: Flag[];
  gameTime: number;
  isGameOver: boolean;
  nextHeroId: number;
  nextEnemyId: number;
}

// Action types
export type GameAction =
  | { type: 'SELECT_BUILDING'; buildingType: string }
  | { type: 'SELECT_FLAG'; flagType: string }
  | { type: 'CANCEL_SELECTION' }
  | { type: 'PLACE_BUILDING'; x: number; y: number }
  | { type: 'PLACE_FLAG'; x: number; y: number }
  | { type: 'SELECT_ENTITY'; entity: unknown; entityType: string }
  | { type: 'UPDATE_GAME_STATE'; updates: Partial<GameState> }
  | { type: 'RESTART_GAME' };
