import { container } from "@providers/inversify/container";
import { MapLoader } from "@providers/map/MapLoader";
import { NPC_BATTLE_CYCLES } from "@providers/npc/NPCBattleCycle";
import { NPC_CYCLES } from "@providers/npc/NPCCycle";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import redis from "./redisV4Mock";

let mongoServer: MongoMemoryServer;

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
