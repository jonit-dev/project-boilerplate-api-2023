import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";
import { NPCMovement } from "../NPCMovement";

describe("NPCMovement.ts", () => {
  let npcMovement: NPCMovement;
  let testNPC: INPC;
  let testCharacter: ICharacter;
  let inMemoryHashTable: InMemoryHashTable;

  beforeAll(async () => {
    npcMovement = container.get<NPCMovement>(NPCMovement);
    await unitTestHelper.initializeMapLoader();
    inMemoryHashTable = container.get<InMemoryHashTable>(InMemoryHashTable);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC({
      x: FromGridX(5),
      y: FromGridY(4),
      initialX: FromGridX(5),
      initialY: FromGridY(4),
    });

    testCharacter = await unitTestHelper.createMockCharacter({
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

  it("should not freeze the NPC if it's a raidNPC", async () => {
    testNPC.raidKey = "testRaidKey";
    await testNPC.save();

    // @ts-ignore
    const mockIsNonPVPZoneAtXY = jest.spyOn(npcMovement.mapNonPVPZone, "isNonPVPZoneAtXY").mockReturnValue(true);

    const moved = await npcMovement.moveNPC(testNPC, testNPC.x, testNPC.y, FromGridX(6), FromGridY(4), "right");

    expect(mockIsNonPVPZoneAtXY).not.toHaveBeenCalled();
    expect(moved).toBe(true);
  });

  it("should freeze the NPC it's not a raidNPC", async () => {
    testNPC.raidKey = undefined;
    await testNPC.save();

    // @ts-ignore
    const mockIsNonPVPZoneAtXY = jest.spyOn(npcMovement.mapNonPVPZone, "isNonPVPZoneAtXY").mockReturnValue(true);

    const moved = await npcMovement.moveNPC(testNPC, testNPC.x, testNPC.y, FromGridX(6), FromGridY(4), "right");

    expect(mockIsNonPVPZoneAtXY).toHaveBeenCalled();
    expect(moved).toBe(true);
  });
});
