import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { characterMock } from "@providers/unitTests/mock/characterMock";
import {
  fixedPathMockNPC,
  moveAwayMockNPC,
  moveTowardsMockNPC,
  randomMovementMockNPC,
  stoppedMovementMockNPC,
} from "@providers/unitTests/mock/NPCMock";
import { NPCMovementType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

@provide(UnitTestHelper)
export class UnitTestHelper {
  private mongoServer: MongoMemoryServer;

  public async createMockNPC(
    extraProps?: Record<string, unknown>,
    movementType: NPCMovementType = NPCMovementType.Random
  ): Promise<INPC> {
    const movementTypeMock = {
      [NPCMovementType.FixedPath]: fixedPathMockNPC,
      [NPCMovementType.MoveAway]: moveAwayMockNPC,
      [NPCMovementType.MoveTowards]: moveTowardsMockNPC,
      [NPCMovementType.Random]: randomMovementMockNPC,
      [NPCMovementType.Stopped]: stoppedMovementMockNPC,
    };

    const npcSkills = new Skill();
    await npcSkills.save();

    const testNPC = new NPC({
      ...movementTypeMock[movementType],
      ...extraProps,
      skills: npcSkills._id,
    });

    await testNPC.save();

    npcSkills.owner = testNPC._id;
    await npcSkills.save();

    return testNPC;
  }

  public async createMockCharacter(extraProps?: Record<string, unknown>): Promise<ICharacter> {
    const charSkills = new Skill();
    await charSkills.save();

    const testCharacter = new Character({
      ...characterMock,
      ...extraProps,
      skills: charSkills._id,
    });

    await testCharacter.save();

    charSkills.owner = testCharacter._id;
    await charSkills.save();

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
