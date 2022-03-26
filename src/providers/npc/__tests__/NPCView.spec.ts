/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { NPCView } from "../NPCView";

describe("NPCVIew", () => {
  let mongoServer: MongoMemoryServer;

  let npcView: NPCView;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "test-database" });
  });

  beforeEach(() => {
    npcView = container.get<NPCView>(NPCView);
  });

  it("should return a test NPC and Character", async () => {
    const testNPC = await unitTestHelper.getMockNPC();
    const testCharacter = await unitTestHelper.getMockCharacter();

    expect(testNPC).toBeDefined();
    expect(testCharacter).toBeDefined();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });
});

// your code here
