import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";
import { NPCMovement } from "../NPCMovement";

describe("NPCMovement.ts", () => {
  let npcMovement: NPCMovement;
  let testNPC: INPC;

  beforeAll(async () => {
    npcMovement = container.get<NPCMovement>(NPCMovement);
    await unitTestHelper.initializeMapLoader();
  });

  beforeEach(async () => {
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

  it("should get the shortest path to a gridX and gridY position", async () => {
    const shortestPath = await npcMovement.getShortestPathNextPosition(
      testNPC,
      null,
      ToGridX(testNPC.x),
      ToGridY(testNPC.y),
      7,
      5
    );

    if (!shortestPath) {
      throw new Error("No shortest path found!");
    }

    expect(shortestPath.newGridX).toBe(6);
    expect(shortestPath.newGridY).toBe(4);
    expect(shortestPath.nextMovementDirection).toBe("right");
  });

  it("should properly move NPC to a selected position", async () => {
    await npcMovement.moveNPC(testNPC, testNPC.x, testNPC.y, FromGridX(6), FromGridY(4), "right");
    testNPC = (await NPC.findById(testNPC._id)) as INPC;

    expect(testNPC.x).toBe(FromGridX(6));
    expect(testNPC.y).toBe(FromGridY(4));
    expect(testNPC.direction).toBe("right");
  });
});
