/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NPC } from "@entities/ModuleSystem/NPCModel";
import { container } from "@providers/inversify/container";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { NPCView } from "../NPCView";
import { mockNPC } from "./mock/NPCMock";

describe("NPCVIew", () => {
  let mongoServer: MongoMemoryServer;

  let npcView;
  let testNPC;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "verifyMASTER" });

    npcView = container.get<NPCView>(NPCView);
  });

  it("should return a test NPC", async () => {
    let testNPC = await NPC.findOne({ key: mockNPC.key });

    if (!testNPC) {
      testNPC = new NPC(mockNPC);
      await testNPC.save();
    }
    expect(testNPC).toBeDefined();
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
