import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { NPCMovementType } from "@rpg-engine/shared";
import { NPCMovementRandomPath } from "../NPCMovementRandomPath";

describe("NPCMovementRandom.ts", () => {
  let npcMovementRandom: NPCMovementRandomPath;

  let testNPC: INPC;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    await unitTestHelper.initializeMapLoader();

    npcMovementRandom = container.get<NPCMovementRandomPath>(NPCMovementRandomPath);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPC = await unitTestHelper.createMockNPC(null, null, NPCMovementType.Random);
  });

  it("should properly move to a random square", async () => {
    await npcMovementRandom.startRandomMovement(testNPC);

    testNPC = (await NPC.findById(testNPC._id)) as INPC;

    expect(testNPC.x !== testNPC.initialX || testNPC.y !== testNPC.initialY).toBe(true);
  });

  it("should go back if movement is out of range", async () => {
    const outOfRangeNPC = await unitTestHelper.createMockNPC(
      {
        x: 999,
        y: 999,
        initialX: 0,
        initialY: 0,
      },
      null,
      NPCMovementType.Random
    );

    const isRandomMovementCompleted = await npcMovementRandom.startRandomMovement(outOfRangeNPC);

    expect(isRandomMovementCompleted).toBeFalsy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
