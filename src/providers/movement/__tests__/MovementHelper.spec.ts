/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";

describe("MovementHelper.ts", () => {
  let movementHelper: MovementHelper;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    await unitTestHelper.initializeMapLoader();
    movementHelper = container.get<MovementHelper>(MovementHelper);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  // it("should properly detect a solid NPC", async () => {
  //   const npc = await unitTestHelper.createMockNPC();

  //   const hasSolidNPC = await movementHelper.isSolid(npc.scene, ToGridX(npc.x), ToGridY(npc.y), npc.layer);

  //   expect(hasSolidNPC).toBeTruthy();
  // });

  it("should properly detect if a position is snapped or not to grid", () => {
    const isSnappedToGrid = movementHelper.isSnappedToGrid(16, 16);

    expect(isSnappedToGrid).toBeTruthy();

    const isNotSnappedToGrid = movementHelper.isSnappedToGrid(15, 15);

    expect(isNotSnappedToGrid).toBeFalsy();
  });

  it("should properly detect an empty tile near a NPC", async () => {
    const npc = await unitTestHelper.createMockNPC();

    const hasSolidNPC = await movementHelper.isSolid(npc.scene, ToGridX(npc.x) + 16, ToGridY(npc.y), npc.layer);

    expect(hasSolidNPC).toBeFalsy();
  });

  it("should properly detect a solid character", async () => {
    const character = await unitTestHelper.createMockCharacter();

    const hasSolidCharacter = await movementHelper.isSolid(
      character.scene,
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
