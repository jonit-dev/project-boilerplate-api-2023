/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  CLASS_BONUS_OR_PENALTIES,
  MODE_EXP_MULTIPLIER,
  RACE_BONUS_OR_PENALTIES,
} from "@providers/character/__tests__/mockConstants/SkillConstants.mock";
import { blueprintManager, container, redisManager } from "@providers/inversify/container";
import { MapLoader } from "@providers/map/MapLoader";
import { NPC_BATTLE_CYCLES } from "@providers/npc/NPCBattleCycle";
import { NPC_CYCLES } from "@providers/npc/NPCCycle";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

jest.mock("speedgoose", () => ({
  clearCacheForKey: jest.fn(() => Promise.resolve()),
  applySpeedGooseCacheLayer: jest.fn(),
  SpeedGooseCacheAutoCleaner: jest.fn(),
}));

jest.mock("@rpg-engine/shared", () => ({
  ...jest.requireActual("@rpg-engine/shared"),
  MagicPower: {
    UltraLow: 5,
    Low: 10,
    Medium: 15,
    High: 20,
    UltraHigh: 25,
    Fatal: 30,
  },
}));

// @ts-ignore
mongoose.Query.prototype.cacheQuery = function () {
  // This is a no-op function
  return this;
};

// mock skill constants to always the same, to avoid having to adjust all tests whenever we change them
jest.mock("@providers/constants/SkillConstants", () => ({
  SP_INCREASE_RATIO: 0.2,
  SP_MAGIC_INCREASE_TIMES_MANA: 0.4,
  INCREASE_BONUS_FACTION: 0.1,
  EXP_RATIO: 1,
  CLASS_BONUS_OR_PENALTIES,
  RACE_BONUS_OR_PENALTIES,
  POWER_COEFFICIENT: 1.5,
  MODE_EXP_MULTIPLIER,
  HEALTH_MANA_BASE_INCREASE_RATE: 10,
}));

jest.mock("@providers/constants/LootConstants", () => ({
  LOOT_GOLD_LEVEL_WEIGHT: 1.5,
  LOOT_GOLD_MAX_HEALTH_WEIGHT: 0.25,
  LOOT_GOLD_QTY_RATIO: 1.5,
  LOOT_GOLD_RESISTANCE_WEIGHT: 1.5,
  LOOT_GOLD_STRENGTH_WEIGHT: 1,
  LOOT_CRAFTING_MATERIAL_DROP_CHANCE: 1,
  LOOT_GOLD_DROP_CHANCE: 1,
  NPC_LOOT_CHANCE_MULTIPLIER: 1,
}));

jest.mock("@providers/constants/CraftingConstants", () => ({
  CRAFTING_MIN_LEVEL_RATIO: 1,
}));

jest.mock("@providers/constants/ItemConstants", () => ({
  TRADER_SELL_PRICE_MULTIPLIER: 0.5,
  TRADER_BUY_PRICE_MULTIPLIER: 1.5,
  MARKETPLACE_BUY_PRICE_MULTIPLIER: 1.5,
  MARKETPLACE_SELL_PRICE_MULTIPLIER: 0.5,
  ITEM_USE_WITH_BASE_EFFECT: 1,
  ITEM_USE_WITH_BASE_SCALING_FACTOR: 0.008,
  ITEM_CLEANUP_THRESHOLD: 100,
}));

jest.mock("@providers/constants/NPCConstants", () => ({
  ...jest.requireActual("@providers/constants/NPCConstants"),
  NPC_TRADER_INTERACTION_DISTANCE: 2,
}));

jest.mock("@providers/constants/PVPConstants", () => ({
  PVP_MIN_REQUIRED_LV: 8,
  PVP_ROGUE_ATTACK_DAMAGE_INCREASE_MULTIPLIER: 0.1,
}));

jest.mock("mongoose-update-if-current", () => ({
  updateIfCurrentPlugin: jest.fn(), // mock the plugin because otherwise it will break many tests
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), {
    dbName: "test-database",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  await mongoose.connection.db.dropDatabase();

  await redisManager.connect();

  await blueprintManager.loadAllBlueprints();
});

afterAll(async () => {
  jest.clearAllTimers();

  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  await mongoServer.stop({
    doCleanup: true,
    force: true,
  });

  container.unload();

  await mongoose.disconnect();

  MapLoader.maps.clear();
  NPC_BATTLE_CYCLES.clear();
  NPC_CYCLES.clear();

  await redisManager.client.flushAll();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});
