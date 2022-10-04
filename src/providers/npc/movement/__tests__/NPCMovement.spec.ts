import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";
import { NPCMovement } from "../NPCMovement";

describe("NPCMovement.ts", () => {
  let npcMovement: NPCMovement;
  let testNPC: INPC;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    npcMovement = container.get<NPCMovement>(NPCMovement);
    await unitTestHelper.initializeMapLoader();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPC = await unitTestHelper.createMockNPC({
      x: FromGridX(5),
      y: FromGridY(4),
      initialX: FromGridX(5),
      initialY: FromGridY(4),
    });
  });

  it("should properly check if NPC is at a gridX and gridY position", () => {
    const isAtPosition = npcMovement.isNPCAtPathPosition(testNPC, 5, 4);

    expect(isAtPosition).toBe(true);
  });

  it("should properly check if NPC is NOT at a gridX and gridY position", () => {
    const isAtPosition = npcMovement.isNPCAtPathPosition(testNPC, 0, 0);

    expect(isAtPosition).toBe(false);
  });

  it("should get the shortest path to a gridX and gridY position", () => {
    const { newGridX, newGridY, nextMovementDirection } = npcMovement.getShortestPathNextPosition(
      testNPC,
      ToGridX(testNPC.x),
      ToGridY(testNPC.y),
      7,
      5
    )!;

    expect(newGridX).toBe(6);
    expect(newGridY).toBe(4);
    expect(nextMovementDirection).toBe("right");
  });

  it("should properly move NPC to a selected position", async () => {
    await npcMovement.moveNPC(testNPC, testNPC.x, testNPC.y, FromGridX(6), FromGridY(4), "right");

    expect(testNPC.x).toBe(FromGridX(6));
    expect(testNPC.y).toBe(FromGridY(4));
    expect(testNPC.direction).toBe("right");
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
