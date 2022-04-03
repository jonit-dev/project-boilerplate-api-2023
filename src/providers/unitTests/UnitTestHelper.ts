import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { characterMock } from "@providers/unitTests/mock/characterMock";
import { mockNPC } from "@providers/unitTests/mock/NPCMock";
import { provide } from "inversify-binding-decorators";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

@provide(UnitTestHelper)
export class UnitTestHelper {
  private mongoServer: MongoMemoryServer;

  public async createMockNPC(extraProps?: Record<string, unknown>): Promise<INPC> {
    const testNPC = new NPC({
      ...mockNPC,
      ...extraProps,
    });
    await testNPC.save();

    return testNPC;
  }

  public async createMockCharacter(extraProps?: Record<string, unknown>): Promise<ICharacter> {
    const testCharacter = new Character({
      ...characterMock,
      ...extraProps,
    });
    await testCharacter.save();

    return testCharacter;
  }

  public async beforeAllJestHook(): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(this.mongoServer.getUri(), {
      dbName: "test-database",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }

  public async beforeEachJestHook(dropDatabase?: boolean): Promise<void> {
    if (dropDatabase) {
      await mongoose.connection.dropDatabase();
    }
  }

  public async afterAllJestHook(): Promise<void> {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }
  }
}
