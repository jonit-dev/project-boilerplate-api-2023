import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, tilemapParser, unitTestHelper } from "@providers/inversify/container";
import { NPCMovementType } from "@rpg-engine/shared";
import { NPCMovementRandomPath } from "../NPCMovementRandomPath";

describe("NPCMovementRandom.ts", () => {
  let npcMovementRandom: NPCMovementRandomPath;

  let testNPC: INPC;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    npcMovementRandom = container.get<NPCMovementRandomPath>(NPCMovementRandomPath);
    await tilemapParser.init();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPC = await unitTestHelper.createMockNPC({}, NPCMovementType.Random);
  });

  it("should properly move to a random square", async () => {
    await npcMovementRandom.startRandomMovement(testNPC);

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
      NPCMovementType.Random
    );

    const isRandomMovementCompleted = await npcMovementRandom.startRandomMovement(outOfRangeNPC);

    expect(isRandomMovementCompleted).toBeFalsy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
