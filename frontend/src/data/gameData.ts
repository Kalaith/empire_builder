import type {
  BuildingType,
  HeroClass,
  HeroSpecialization,
  Equipment,
  FlagType,
  EnemyType,
  Quest,
  Achievement,
} from '../types/game';

export const BUILDING_TYPES: Record<string, BuildingType> = {
  castle: {
    name: "Castle",
    cost: { gold: 0 },
    production: { gold: 10, population: 5 },
    maxLevel: 10,
    upgrades: [
      { level: 2, name: "Royal Quarters", cost: { gold: 500 }, benefits: { gold: 5, population: 2 }, requirements: [], description: "Expand the castle with royal quarters" },
      { level: 3, name: "Treasury", cost: { gold: 1000 }, benefits: { gold: 10 }, requirements: [], description: "Build a treasury to increase gold production" }
    ],
    category: 'special',
    color: "#8B4513",
    symbol: "🏰",
    description: "The heart of your kingdom, provides leadership and basic resources",
    prerequisites: []
  },
  warriorGuild: {
    name: "Warrior Guild",
    cost: { gold: 100, supplies: 20 },
    production: { population: -1 },
    maxLevel: 5,
    upgrades: [
      { level: 2, name: "Training Grounds", cost: { gold: 200, supplies: 30 }, benefits: {}, requirements: [], description: "Better training facilities for warriors" }
    ],
    category: 'guild',
    color: "#FF6B6B",
    symbol: "⚔️",
    description: "Trains mighty warriors to defend your kingdom",
    prerequisites: []
  },
  rangerGuild: {
    name: "Ranger Guild",
    cost: { gold: 120, supplies: 25 },
    production: { population: -1 },
    maxLevel: 5,
    upgrades: [
      { level: 2, name: "Archery Range", cost: { gold: 250, supplies: 35 }, benefits: {}, requirements: [], description: "Advanced archery training facility" }
    ],
    category: 'guild',
    color: "#4ECDC4",
    symbol: "🏹",
    description: "Trains skilled rangers for exploration and ranged combat",
    prerequisites: []
  },
  wizardGuild: {
    name: "Wizard Guild",
    cost: { gold: 150, supplies: 30 },
    production: { mana: 5, population: -1 },
    maxLevel: 5,
    upgrades: [
      { level: 2, name: "Arcane Library", cost: { gold: 300, supplies: 40 }, benefits: { mana: 3 }, requirements: [], description: "A library of magical knowledge" }
    ],
    category: 'guild',
    color: "#45B7D1",
    symbol: "🔮",
    description: "Trains powerful wizards and generates mana",
    prerequisites: []
  },
  rogueGuild: {
    name: "Rogue Guild",
    cost: { gold: 80, supplies: 15 },
    production: { gold: 3, population: -1 },
    maxLevel: 5,
    upgrades: [
      { level: 2, name: "Thieves' Den", cost: { gold: 150, supplies: 25 }, benefits: { gold: 2 }, requirements: [], description: "Underground network for rogues" }
    ],
    category: 'guild',
    color: "#96CEB4",
    symbol: "🗡️",
    description: "Trains stealthy rogues who bring in extra gold",
    prerequisites: []
  },
  marketplace: {
    name: "Marketplace",
    cost: { gold: 60, supplies: 10 },
    production: { gold: 15 },
    maxLevel: 8,
    upgrades: [
      { level: 2, name: "Trade Routes", cost: { gold: 150, supplies: 20 }, benefits: { gold: 8 }, requirements: [], description: "Establish profitable trade routes" }
    ],
    category: 'economy',
    color: "#FFEAA7",
    symbol: "🏪",
    description: "Central hub for trade and commerce",
    prerequisites: []
  },
  blacksmith: {
    name: "Blacksmith",
    cost: { gold: 80, supplies: 25 },
    production: { gold: 8, supplies: 2 },
    maxLevel: 6,
    upgrades: [
      { level: 2, name: "Master Forge", cost: { gold: 200, supplies: 40 }, benefits: { supplies: 3 }, requirements: [], description: "A master-level forge for superior equipment" }
    ],
    category: 'economy',
    color: "#636E72",
    symbol: "🔨",
    description: "Produces equipment and supplies for your forces",
    prerequisites: []
  },
  inn: {
    name: "Inn",
    cost: { gold: 50, supplies: 8 },
    production: { gold: 12, population: 1 },
    maxLevel: 6,
    upgrades: [
      { level: 2, name: "Tavern Hall", cost: { gold: 120, supplies: 15 }, benefits: { gold: 6, population: 1 }, requirements: [], description: "A grand tavern hall for visitors" }
    ],
    category: 'economy',
    color: "#FD79A8",
    symbol: "🍺",
    description: "Attracts visitors and provides rest for heroes",
    prerequisites: []
  },
  guardTower: {
    name: "Guard Tower",
    cost: { gold: 40, supplies: 20 },
    production: { gold: 2 },
    maxLevel: 4,
    upgrades: [
      { level: 2, name: "Watchtower", cost: { gold: 100, supplies: 30 }, benefits: {}, requirements: [], description: "Enhanced tower with better visibility" }
    ],
    category: 'defense',
    color: "#2D3436",
    symbol: "🗼",
    description: "Defensive structure that watches for enemies",
    prerequisites: []
  }
};

export const HERO_CLASSES: Record<string, HeroClass> = {
  warrior: {
    name: "Warrior",
    baseHealth: 100,
    baseDamage: 20,
    baseSpeed: 1,
    color: "#FF6B6B",
    symbol: "🛡️",
    preferences: ["attack", "defend"],
    specializations: ["guardian", "berserker", "paladin"],
    description: "Heavily armored fighters who excel in direct combat"
  },
  ranger: {
    name: "Ranger",
    baseHealth: 80,
    baseDamage: 15,
    baseSpeed: 2,
    color: "#4ECDC4",
    symbol: "🏹",
    preferences: ["explore", "attack"],
    specializations: ["scout", "hunter", "beastmaster"],
    description: "Swift archers skilled in ranged combat and exploration"
  },
  wizard: {
    name: "Wizard",
    baseHealth: 60,
    baseDamage: 25,
    baseSpeed: 1,
    color: "#45B7D1",
    symbol: "🔮",
    preferences: ["attack", "explore"],
    specializations: ["elementalist", "necromancer", "enchanter"],
    description: "Masters of arcane magic with devastating spells"
  },
  rogue: {
    name: "Rogue",
    baseHealth: 70,
    baseDamage: 18,
    baseSpeed: 2,
    color: "#96CEB4",
    symbol: "🗡️",
    preferences: ["gold", "explore"],
    specializations: ["assassin", "thief", "shadowdancer"],
    description: "Stealthy operatives who strike from the shadows"
  }
};

export const HERO_SPECIALIZATIONS: Record<string, HeroSpecialization> = {
  // Warrior Specializations
  guardian: {
    id: "guardian",
    name: "Guardian",
    description: "Master of defense and protection",
    healthBonus: 30,
    damageBonus: 5,
    speedBonus: 0,
    specialAbilities: ["taunt", "shield_wall", "protect_ally"],
    unlockLevel: 3
  },
  berserker: {
    id: "berserker",
    name: "Berserker",
    description: "Fury-driven warrior with devastating attacks",
    healthBonus: 10,
    damageBonus: 15,
    speedBonus: 1,
    specialAbilities: ["rage", "bloodlust", "cleave"],
    unlockLevel: 3
  },
  paladin: {
    id: "paladin",
    name: "Paladin",
    description: "Holy warrior blessed with divine power",
    healthBonus: 25,
    damageBonus: 10,
    speedBonus: 0,
    specialAbilities: ["heal", "divine_smite", "blessing"],
    unlockLevel: 5
  },
  // Ranger Specializations
  scout: {
    id: "scout",
    name: "Scout",
    description: "Master of reconnaissance and stealth",
    healthBonus: 5,
    damageBonus: 8,
    speedBonus: 3,
    specialAbilities: ["stealth", "track", "ambush"],
    unlockLevel: 3
  },
  hunter: {
    id: "hunter",
    name: "Hunter",
    description: "Deadly marksman with enhanced accuracy",
    healthBonus: 10,
    damageBonus: 12,
    speedBonus: 1,
    specialAbilities: ["piercing_shot", "trap", "mark_target"],
    unlockLevel: 3
  },
  beastmaster: {
    id: "beastmaster",
    name: "Beastmaster",
    description: "Commands animal companions in battle",
    healthBonus: 15,
    damageBonus: 5,
    speedBonus: 2,
    specialAbilities: ["summon_wolf", "animal_bond", "pack_leader"],
    unlockLevel: 5
  },
  // Wizard Specializations
  elementalist: {
    id: "elementalist",
    name: "Elementalist",
    description: "Master of fire, ice, and lightning magic",
    healthBonus: 5,
    damageBonus: 20,
    speedBonus: 0,
    specialAbilities: ["fireball", "ice_shard", "lightning_bolt"],
    unlockLevel: 3
  },
  necromancer: {
    id: "necromancer",
    name: "Necromancer",
    description: "Dark mage who commands the undead",
    healthBonus: 10,
    damageBonus: 15,
    speedBonus: 0,
    specialAbilities: ["raise_skeleton", "drain_life", "curse"],
    unlockLevel: 5
  },
  enchanter: {
    id: "enchanter",
    name: "Enchanter",
    description: "Support mage who enhances allies",
    healthBonus: 15,
    damageBonus: 8,
    speedBonus: 1,
    specialAbilities: ["enhance_weapon", "magic_shield", "haste"],
    unlockLevel: 3
  },
  // Rogue Specializations
  assassin: {
    id: "assassin",
    name: "Assassin",
    description: "Silent killer with deadly precision",
    healthBonus: 5,
    damageBonus: 18,
    speedBonus: 2,
    specialAbilities: ["backstab", "poison", "vanish"],
    unlockLevel: 3
  },
  thief: {
    id: "thief",
    name: "Thief",
    description: "Master of stealth and acquisition",
    healthBonus: 10,
    damageBonus: 8,
    speedBonus: 3,
    specialAbilities: ["steal", "lockpick", "sleight_of_hand"],
    unlockLevel: 3
  },
  shadowdancer: {
    id: "shadowdancer",
    name: "Shadowdancer",
    description: "Mystical rogue who bends shadows to their will",
    healthBonus: 8,
    damageBonus: 12,
    speedBonus: 4,
    specialAbilities: ["shadow_step", "darkness", "shadow_clone"],
    unlockLevel: 5
  }
};

export const EQUIPMENT: Record<string, Equipment> = {
  // Weapons
  ironSword: {
    id: "iron_sword",
    name: "Iron Sword",
    type: "weapon",
    rarity: "common",
    healthBonus: 0,
    damageBonus: 8,
    speedBonus: 0,
    cost: 50,
    description: "A sturdy iron blade"
  },
  steelSword: {
    id: "steel_sword",
    name: "Steel Sword",
    type: "weapon",
    rarity: "rare",
    healthBonus: 0,
    damageBonus: 15,
    speedBonus: 1,
    cost: 150,
    description: "A masterwork steel blade"
  },
  enchantedBlade: {
    id: "enchanted_blade",
    name: "Enchanted Blade",
    type: "weapon",
    rarity: "epic",
    healthBonus: 5,
    damageBonus: 25,
    speedBonus: 2,
    cost: 500,
    description: "A blade infused with magical energy"
  },
  // Armor
  leatherArmor: {
    id: "leather_armor",
    name: "Leather Armor",
    type: "armor",
    rarity: "common",
    healthBonus: 15,
    damageBonus: 0,
    speedBonus: 0,
    cost: 40,
    description: "Basic leather protection"
  },
  chainmail: {
    id: "chainmail",
    name: "Chainmail",
    type: "armor",
    rarity: "rare",
    healthBonus: 30,
    damageBonus: 0,
    speedBonus: -1,
    cost: 120,
    description: "Interlocked metal rings"
  },
  plateArmor: {
    id: "plate_armor",
    name: "Plate Armor",
    type: "armor",
    rarity: "epic",
    healthBonus: 50,
    damageBonus: 5,
    speedBonus: -2,
    cost: 400,
    description: "Full suit of plate armor"
  },
  // Accessories
  healthRing: {
    id: "health_ring",
    name: "Ring of Vitality",
    type: "accessory",
    rarity: "rare",
    healthBonus: 25,
    damageBonus: 0,
    speedBonus: 0,
    cost: 200,
    description: "A ring that enhances life force"
  },
  speedBoots: {
    id: "speed_boots",
    name: "Boots of Swiftness",
    type: "accessory",
    rarity: "rare",
    healthBonus: 0,
    damageBonus: 0,
    speedBonus: 3,
    cost: 180,
    description: "Magical boots that enhance movement"
  },
  powerAmulet: {
    id: "power_amulet",
    name: "Amulet of Power",
    type: "accessory",
    rarity: "epic",
    healthBonus: 10,
    damageBonus: 10,
    speedBonus: 1,
    cost: 350,
    description: "An amulet radiating with power"
  }
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

export const SAMPLE_QUESTS: Quest[] = [
  {
    id: "first_hero",
    title: "Recruit Your First Hero",
    description: "Build a guild and recruit your first hero to begin your adventure",
    type: "build",
    objectives: [
      { id: "build_guild", description: "Build any guild", type: "build", target: 1, current: 0, isCompleted: false },
      { id: "recruit_hero", description: "Recruit a hero", type: "recruit", target: 1, current: 0, isCompleted: false }
    ],
    rewards: { gold: 100, supplies: 20 },
    isActive: true,
    isCompleted: false,
    difficulty: "easy"
  },
  {
    id: "defeat_enemies",
    title: "Defend the Kingdom",
    description: "Eliminate 10 enemies that threaten your kingdom",
    type: "kill",
    objectives: [
      { id: "kill_enemies", description: "Defeat 10 enemies", type: "kill", target: 10, current: 0, isCompleted: false }
    ],
    rewards: { gold: 200, mana: 50 },
    isActive: false,
    isCompleted: false,
    difficulty: "medium"
  },
  {
    id: "level_up_hero",
    title: "Hero Training",
    description: "Train a hero to reach level 5",
    type: "collect",
    objectives: [
      { id: "hero_level_5", description: "Get a hero to level 5", type: "level", target: 5, current: 0, isCompleted: false }
    ],
    rewards: { gold: 150, supplies: 30 },
    isActive: false,
    isCompleted: false,
    difficulty: "medium"
  }
];

export const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: "kingdom_founder",
    title: "Kingdom Founder",
    description: "Start your kingdom and build your castle",
    category: "building",
    requirements: { castleBuilt: 1 },
    rewards: { gold: 50 },
    isUnlocked: false,
    progress: { castleBuilt: 0 },
    icon: "🏰"
  },
  {
    id: "first_victory",
    title: "First Victory",
    description: "Win your first combat encounter",
    category: "combat",
    requirements: { enemiesDefeated: 1 },
    rewards: { gold: 100, supplies: 10 },
    isUnlocked: false,
    progress: { enemiesDefeated: 0 },
    icon: "⚔️"
  },
  {
    id: "hero_master",
    title: "Hero Master",
    description: "Have 10 heroes in your kingdom at once",
    category: "heroes",
    requirements: { simultaneousHeroes: 10 },
    rewards: { gold: 500, mana: 100 },
    isUnlocked: false,
    progress: { simultaneousHeroes: 0 },
    icon: "👑"
  },
  {
    id: "wealthy_kingdom",
    title: "Wealthy Kingdom",
    description: "Accumulate 10,000 gold",
    category: "economy",
    requirements: { goldAccumulated: 10000 },
    rewards: { supplies: 200 },
    isUnlocked: false,
    progress: { goldAccumulated: 0 },
    icon: "💰"
  },
  {
    id: "master_builder",
    title: "Master Builder",
    description: "Construct 50 buildings total",
    category: "building",
    requirements: { buildingsConstructed: 50 },
    rewards: { gold: 1000, mana: 200 },
    isUnlocked: false,
    progress: { buildingsConstructed: 0 },
    icon: "🔨"
  }
];

// Game configuration constants
export const GAME_CONFIG = {
  GRID_WIDTH: 20,
  GRID_HEIGHT: 15,
  STARTING_RESOURCES: {
    gold: 500,
    mana: 50,
    supplies: 100,
    population: 0,
    maxPopulation: 10
  },
  INCOME_INTERVAL: 2000, // ms
  ENEMY_SPAWN_INTERVAL: 8000, // ms
  GAME_LOOP_INTERVAL: 1000, // ms
  EXPERIENCE_MULTIPLIER: 100,
  LEVEL_MULTIPLIER: 1.2,
  BASE_EXPERIENCE: 100,
  MAX_SAVE_SLOTS: 5,
  AUTO_SAVE_INTERVAL: 30000, // ms
  MORALE_DECAY_RATE: 0.1, // per game loop
  RELATIONSHIP_CHANGE_RATE: 1,
  COMBAT_ANIMATION_DURATION: 1000, // ms
  BUILDING_CONSTRUCTION_TIME: 3000, // ms
  HERO_RESPAWN_TIME: 30000 // ms
} as const;
