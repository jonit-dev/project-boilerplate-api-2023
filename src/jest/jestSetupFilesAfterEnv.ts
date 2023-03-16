import {
  CLASS_BONUS_OR_PENALTIES,
  RACE_BONUS_OR_PENALTIES,
} from "@providers/character/__tests__/mockConstants/SkillConstants.mock";
import { container, redisManager } from "@providers/inversify/container";
import { MapLoader } from "@providers/map/MapLoader";
import { NPC_BATTLE_CYCLES } from "@providers/npc/NPCBattleCycle";
import { NPC_CYCLES } from "@providers/npc/NPCCycle";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

// mock skill constants to always the same, to avoid having to adjust all tests whenever we change them
jest.mock("@providers/constants/SkillConstants", () => ({
  SP_INCREASE_RATIO: 0.2,
  SP_MAGIC_INCREASE_TIMES_MANA: 0.4,
  INCREASE_BONUS_FACTION: 0.1,
  EXP_RATIO: 1,
  CLASS_BONUS_OR_PENALTIES,
  RACE_BONUS_OR_PENALTIES,
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
