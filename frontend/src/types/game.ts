// Game data types
export interface ResourceCost {
  gold?: number;
  mana?: number;
  supplies?: number;
  population?: number;
}

export interface ResourceProduction {
  gold?: number;
  mana?: number;
  supplies?: number;
  population?: number;
}

export interface BuildingUpgrade {
  level: number;
  name: string;
  cost: ResourceCost;
  benefits: ResourceProduction;
  requirements?: string[];
  description: string;
}

export interface BuildingType {
  name: string;
  cost: ResourceCost;
  production: ResourceProduction;
  maxLevel: number;
  upgrades: BuildingUpgrade[];
  category: 'guild' | 'economy' | 'defense' | 'special';
  color: string;
  symbol: string;
  description: string;
  prerequisites?: string[];
  heroCapacity?: number; // For guild buildings
}

export interface HeroClass {
  name: string;
  baseHealth: number;
  baseDamage: number;
  baseSpeed: number;
  color: string;
  symbol: string;
  preferences: string[];
  specializations: string[];
  description: string;
  baseCost: ResourceCost;
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
  level: number;
  name: string;
  cost: ResourceCost;
  production: ResourceProduction;
  isProducing: boolean;
  productionCooldown: number;
  color: string;
  symbol: string;
  healthPoints: number;
  maxHealthPoints: number;
  heroCapacity?: number; // For guild buildings
  heroCount?: number; // Current heroes recruited from this guild
}

export interface HeroSpecialization {
  id: string;
  name: string;
  description: string;
  healthBonus: number;
  damageBonus: number;
  speedBonus: number;
  specialAbilities: string[];
  unlockLevel: number;
}

export interface HeroRelationship {
  heroId: string;
  relationshipType: 'friendship' | 'rivalry' | 'romance';
  strength: number; // -100 to 100
  history: string[];
}

export interface Hero {
  id: string;
  type: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  baseHealth: number;
  maxHealth: number;
  health: number;
  baseDamage: number;
  damage: number;
  baseSpeed: number;
  speed: number;
  gold: number;
  level: number;
  experience: number;
  experienceToNext: number;
  equipment: HeroEquipment;
  skills: HeroSkills;
  specialization?: HeroSpecialization;
  morale: number; // 0-100
  relationships: HeroRelationship[];
  moveCooldown: number;
  lastAction: string;
  combatHistory: CombatRecord[];
  questsCompleted: number;
  heroName: string; // Custom name
  className: string; // Class name
  symbol: string;
  preferences: string[];
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  healthBonus: number;
  damageBonus: number;
  speedBonus: number;
  cost: number;
  description: string;
}

export interface HeroEquipment {
  weapon?: Equipment;
  armor?: Equipment;
  accessory?: Equipment;
}

export interface HeroSkills {
  combat: number; // 0-100
  exploration: number; // 0-100
  leadership: number; // 0-100
  magic?: number; // 0-100, only for wizard-type classes
  stealth?: number; // 0-100, only for rogue-type classes
  ranged?: number; // 0-100, only for ranger-type classes
  defense?: number; // 0-100, only for warrior-type classes
}

export interface CombatRecord {
  timestamp: number;
  opponent: string;
  result: 'victory' | 'defeat' | 'retreat';
  experienceGained: number;
  goldGained: number;
  damageDealt: number;
  damageTaken: number;
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
export interface Resources {
  gold: number;
  mana: number;
  supplies: number;
  population: number;
  maxPopulation: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'kill' | 'build' | 'explore' | 'collect' | 'survive';
  objectives: QuestObjective[];
  rewards: ResourceCost;
  isActive: boolean;
  isCompleted: boolean;
  assignedHeroId?: string;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
}

export interface QuestObjective {
  id: string;
  description: string;
  type: string;
  target: number;
  current: number;
  isCompleted: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'combat' | 'building' | 'heroes' | 'economy' | 'exploration';
  requirements: Record<string, number>;
  rewards: ResourceCost;
  isUnlocked: boolean;
  progress: Record<string, number>;
  icon: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'random' | 'quest' | 'disaster' | 'blessing';
  effects: GameEventEffect[];
  choices?: GameEventChoice[];
  duration?: number;
  isActive: boolean;
}

export interface GameEventEffect {
  type: 'resource' | 'hero_modifier' | 'building_modifier' | 'spawn_enemy';
  target?: string;
  value: number;
  duration?: number;
}

export interface GameEventChoice {
  id: string;
  text: string;
  effects: GameEventEffect[];
  requirements?: ResourceCost;
}

export interface SaveSlot {
  id: number;
  name: string;
  timestamp: number;
  gameState: GameState;
  screenshot?: string;
}

export interface GameState {
  resources: Resources;
  gridWidth: number;
  gridHeight: number;
  grid: GridCell[][];
  buildings: Building[];
  heroes: Hero[];
  enemies: Enemy[];
  flags: Flag[];
  quests: Quest[];
  achievements: Achievement[];
  activeEvents: GameEvent[];
  gameTime: number;
  isGameOver: boolean;
  isPaused: boolean;
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
  nextHeroId: number;
  nextEnemyId: number;
  nextQuestId: number;
  statistics: GameStatistics;
}

export interface GameStatistics {
  totalPlayTime: number;
  totalGoldEarned: number;
  totalHeroesRecruited: number;
  totalEnemiesDefeated: number;
  totalBuildingsConstructed: number;
  totalQuestsCompleted: number;
  highestHeroLevel: number;
  largestPopulation: number;
  sessionsPlayed: number;
  achievementsUnlocked: number;
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
  | { type: 'RESTART_GAME' }
  | { type: 'LEVEL_UP_HERO'; heroId: string }
  | { type: 'ASSIGN_SPECIALIZATION'; heroId: string; specializationId: string }
  | { type: 'UPGRADE_BUILDING'; buildingId: string }
  | { type: 'EQUIP_ITEM'; heroId: string; equipmentId: string }
  | { type: 'START_QUEST'; questId: string; heroId?: string }
  | { type: 'COMPLETE_QUEST'; questId: string }
  | { type: 'TRIGGER_EVENT'; eventId: string }
  | { type: 'PAUSE_GAME' }
  | { type: 'SAVE_GAME'; slotId: number }
  | { type: 'LOAD_GAME'; slotId: number };
