import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, tilemapParser, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";
import { NPCMovement } from "../NPCMovement";

describe("NPCMovement.ts", () => {
  let npcMovement: NPCMovement;
  let testNPC: INPC;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    npcMovement = container.get<NPCMovement>(NPCMovement);
    await tilemapParser.init();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPC = await unitTestHelper.createMockNPC({
      x: FromGridX(0),
      y: FromGridY(0),
    });
  });

  it("should properly check if NPC is at a gridX and gridY position", () => {
    const isAtPosition = npcMovement.isNPCAtPathPosition(testNPC, ToGridX(0), ToGridY(0));

    expect(isAtPosition).toBe(true);
  });

  it("should properly check if NPC is NOT at a gridX and gridY position", () => {
    const isAtPosition = npcMovement.isNPCAtPathPosition(testNPC, ToGridX(10), ToGridY(0));

    expect(isAtPosition).toBe(false);
  });

  it("should get the shortest path to a gridX and gridY position", () => {
    const { newGridX, newGridY, nextMovementDirection } = npcMovement.getShortestPathNextPosition(
      testNPC,
      ToGridX(testNPC.x),
      ToGridY(testNPC.y),
      ToGridX(10),
      ToGridY(0)
    )!;

    expect(newGridX).toBe(1);
    expect(newGridY).toBe(0);
    expect(nextMovementDirection).toBe("right");
  });

  it("should properly move NPC to a selected position", async () => {
    await npcMovement.moveNPC(testNPC, testNPC.x, testNPC.y, FromGridX(10), FromGridY(0), "right");

    expect(testNPC.x).toBe(FromGridX(10));
    expect(testNPC.y).toBe(FromGridY(0));
    expect(testNPC.direction).toBe("right");
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
