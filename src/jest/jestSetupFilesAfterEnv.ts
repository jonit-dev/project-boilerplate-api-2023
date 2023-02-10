import { container } from "@providers/inversify/container";
import { MapLoader } from "@providers/map/MapLoader";
import { NPC_BATTLE_CYCLES } from "@providers/npc/NPCBattleCycle";
import { NPC_CYCLES } from "@providers/npc/NPCCycle";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import redis from "./redisV4Mock";

let mongoServer: MongoMemoryServer;

// mock skill constants to always the same, to avoid having to adjust all tests whenever we change them
jest.mock("@providers/constants/SkillConstants", () => ({
  SP_INCREASE_RATIO: 0.2,
  SP_MAGIC_INCREASE_TIMES_MANA: 0.4,
  INCREASE_BONUS_FACTION: 0.1,
  EXP_RATIO: 1,
}));

jest.mock("mongoose-update-if-current", () => ({
  updateIfCurrentPlugin: jest.fn(), // mock the plugin because otherwise it will break many tests
}));

beforeAll(async () => {
  jest.mock("redis", () => redis);

  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), {
    dbName: "test-database",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  await mongoose.connection.db.dropDatabase();
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
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});
