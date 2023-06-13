export const NPC_BASE_HEALTH_MULTIPLIER = 1.5;
export const NPC_SPEED_MULTIPLIER = 0.75;
export const NPC_SKILL_LEVEL_MULTIPLIER = 1.5;
export const NPC_SKILL_STRENGTH_MULTIPLIER = 1.75;
export const NPC_SKILL_DEXTERITY_MULTIPLIER = 1.25;
export const NPC_SKILL_RESISTANCE_MULTIPLIER = 1.25;

// Performance
export const NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE = 30; // remember that in pm2 (prod) this is multiplied by the number of instances (CPUs)

// PZ
export const NPC_CAN_ATTACK_IN_NON_PVP_ZONE = false;

// Trader
export const NPC_TRADER_INTERACTION_DISTANCE = 10;

// Giant form
export const NPC_GIANT_FORM_SPAWN_PERCENTAGE_CHANCE = 8;
export const NPC_GIANT_FORM_STATS_MULTIPLIER = 1.75;
export const NPC_GIANT_FORM_LOOT_MULTIPLIER = 3;
export const NPC_GIANT_FORM_EXPERIENCE_MULTIPLIER = 1.75;

export const NPC_CYCLE_INTERVAL_RATIO = 0.9;

export const NPC_FREEZE_CHECK_INTERVAL = 10000;
