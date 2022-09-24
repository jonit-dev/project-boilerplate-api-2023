import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, NPCMovementType } from "@rpg-engine/shared";
import { NPCMovementFixedPath } from "../NPCMovementFixedPath";

describe("NPCMovementFixedPath.ts", () => {
  let npcMovementFixedPath: NPCMovementFixedPath;
  let testNPC: INPC;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    npcMovementFixedPath = container.get<NPCMovementFixedPath>(NPCMovementFixedPath);
    await unitTestHelper.initializeMapLoader();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPC = await unitTestHelper.createMockNPC(
      {
        x: FromGridX(8),
        y: FromGridY(7),
      },
      null,
      NPCMovementType.FixedPath
    );
  });

  it("should properly create a path avoiding solids", async () => {
    const correctPaths = [
      { gridX: 9, gridY: 7 },
      { gridX: 10, gridY: 7 },
      { gridX: 11, gridY: 7 },
      { gridX: 11, gridY: 8 },
      { gridX: 12, gridY: 8 },
      { gridX: 12, gridY: 9 },
      { gridX: 12, gridY: 10 },
      { gridX: 12, gridY: 11 },
      { gridX: 12, gridY: 12 },
      { gridX: 13, gridY: 12 },
      { gridX: 13, gridY: 13 },
      { gridX: 13, gridY: 14 },
      { gridX: 13, gridY: 15 },
      { gridX: 13, gridY: 16 },
      { gridX: 14, gridY: 16 },
    ];

    for (const path of correctPaths) {
      await npcMovementFixedPath.startFixedPathMovement(testNPC, 14, 16);
      expect(testNPC.x).toBe(FromGridX(path.gridX));
      expect(testNPC.y).toBe(FromGridY(path.gridY));
    }
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
