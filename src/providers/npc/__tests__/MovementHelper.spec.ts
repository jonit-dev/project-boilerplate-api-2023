/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { FromGridX, FromGridY, ScenesMetaData, ToGridX, ToGridY } from "@rpg-engine/shared";

describe("NPCMovement.ts", () => {
  let movementHelper: MovementHelper;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    movementHelper = container.get<MovementHelper>(MovementHelper);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  it("should properly detect a solid NPC", async () => {
    const npc = await unitTestHelper.createMockNPC();

    const hasSolidNPC = await movementHelper.isSolid(
      ScenesMetaData[npc.scene].map,
      ToGridX(npc.x),
      ToGridY(npc.y),
      npc.layer
    );

    expect(hasSolidNPC).toBeTruthy();
  });

  it("should properly detect an empty tile near a NPC", async () => {
    const npc = await unitTestHelper.createMockNPC();

    const hasSolidNPC = await movementHelper.isSolid(
      ScenesMetaData[npc.scene].map,
      ToGridX(npc.x) + 16,
      ToGridY(npc.y),
      npc.layer
    );

    expect(hasSolidNPC).toBeFalsy();
  });

  it("should properly detect a solid character", async () => {
    const character = await unitTestHelper.createMockCharacter();

    const hasSolidCharacter = await movementHelper.isSolid(
      ScenesMetaData[character.scene].map,
      ToGridX(character.x),
      ToGridY(character.y),
      character.layer
    );

    expect(hasSolidCharacter).toBeTruthy();
  });

  it("should properly detect if a position is under range", () => {
    const isUnderRange = movementHelper.isUnderRange(FromGridX(0), FromGridY(0), FromGridX(10), FromGridY(0), 10);

    expect(isUnderRange).toBeTruthy();
  });

  it("should properly detect if position is out of range", () => {
    const isUnderRange = movementHelper.isUnderRange(FromGridX(0), FromGridY(0), FromGridX(11), FromGridY(0), 10);
    expect(isUnderRange).toBeFalsy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
