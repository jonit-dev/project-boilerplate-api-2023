/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, NPCTargetType, NPC_MAX_TALKING_DISTANCE_IN_GRID } from "@rpg-engine/shared";
import { NPCTarget } from "../movement/NPCTarget";

describe("NPCTarget.ts", () => {
  let npcTarget: NPCTarget;
  let testNPC: INPC;
  let testCharacter: ICharacter;
  let inMemoryHashTable: InMemoryHashTable;

  beforeAll(async () => {
    await unitTestHelper.initializeMapLoader();

    npcTarget = container.get<NPCTarget>(NPCTarget);
    inMemoryHashTable = container.get<InMemoryHashTable>(InMemoryHashTable);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC(
      {
        x: FromGridX(0),
        y: FromGridY(0),
        maxAntiLuringRangeInGridCells: 150,
      },
      {
        hasSkills: true,
      }
    );
  });

  it("should properly get target direction", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(10),
      y: FromGridY(0),
    });

    const targetDirection = npcTarget.getTargetDirection(testNPC, testCharacter.x, testCharacter.y);

    expect(targetDirection).toBe("right");
  });

  it("should properly set a target to the closest character, if inside the NPC range", async () => {
    const maxGridRange = testNPC.maxRangeInGridCells!;

    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(maxGridRange),
      y: FromGridY(0),
    });

    // too far away, shouldn't be the range!
    const anotherCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(30),
      y: FromGridY(30),
    });

    await npcTarget.tryToSetTarget(testNPC);

    testNPC = (await NPC.findById(testNPC.id)) as INPC;

    expect(testNPC.targetCharacter).toBeDefined();
    expect(testNPC.targetCharacter?.toString()).toEqual(testCharacter.id.toString());
    expect(testNPC.targetCharacter?.toString()).not.toEqual(anotherCharacter.id.toString());
  });

  it("should not set a target, if character is out of range", async () => {
    await unitTestHelper.createMockCharacter({
      x: FromGridX(999),
      y: FromGridY(999),
    });

    await npcTarget.tryToSetTarget(testNPC);

    testNPC = (await NPC.findById(testNPC.id)) as INPC;

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  it("should clear the target if character is out of range", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });

    await npcTarget.tryToSetTarget(testNPC);

    testNPC = (await NPC.findById(testNPC.id)) as INPC;

    expect(testNPC.targetCharacter).toBeDefined();

    testCharacter.x = 999;
    testCharacter.y = 999;
    await testCharacter.save();

    testCharacter = (await Character.findById(testCharacter.id)) as ICharacter;

    await npcTarget.tryToClearOutOfRangeTargets(testNPC);

    testNPC = (await NPC.findById(testNPC.id)) as INPC;

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  it("should clear the target if character logs out", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });

    await npcTarget.tryToSetTarget(testNPC);

    testNPC = (await NPC.findById(testNPC.id)) as INPC;

    expect(testNPC.targetCharacter).toBeDefined();

    testCharacter.isOnline = false;
    await testCharacter.save();

    await npcTarget.tryToClearOutOfRangeTargets(testNPC);

    testNPC = (await NPC.findById(testNPC.id)) as INPC;

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  it("should clear the target if character starts dialog near, but then go beyond max threshold", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });

    await npcTarget.tryToSetTarget(testNPC);

    testNPC = (await NPC.findById(testNPC.id)) as INPC;

    expect(testNPC.targetCharacter).toBeDefined();
    expect(testNPC.targetCharacter?.toString()).toBe(testCharacter.id.toString());

    testNPC.targetType = NPCTargetType.Talking;
    await testNPC.save();

    testCharacter.x = FromGridX(NPC_MAX_TALKING_DISTANCE_IN_GRID - 1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();

    await npcTarget.tryToClearOutOfRangeTargets(testNPC);

    testNPC = (await NPC.findById(testNPC.id)) as INPC;

    expect(testNPC.targetCharacter).toBeDefined();

    testCharacter.x = FromGridX(NPC_MAX_TALKING_DISTANCE_IN_GRID + 1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();

    await npcTarget.tryToClearOutOfRangeTargets(testNPC);

    testNPC = (await NPC.findById(testNPC.id)) as INPC;

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  it("should not call isNonPVPZoneAtXY if the NPC is a raid NPC", async () => {
    testNPC.raidKey = "test-raid";
    await testNPC.save();

    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });

    // @ts-ignore
    const mockIsNonPVPZoneAtXY = jest.spyOn(npcTarget.mapNonPVPZone, "isNonPVPZoneAtXY").mockReturnValue(true);

    await npcTarget.tryToSetTarget(testNPC);

    expect(mockIsNonPVPZoneAtXY).not.toHaveBeenCalled();
  });

  it("should call isNonPVPZoneAtXY if the NPC not a raid NPC", async () => {
    testNPC.raidKey = undefined;
    await testNPC.save();

    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });

    // @ts-ignore
    const mockIsNonPVPZoneAtXY = jest.spyOn(npcTarget.mapNonPVPZone, "isNonPVPZoneAtXY").mockReturnValue(true);

    await npcTarget.tryToSetTarget(testNPC);

    expect(mockIsNonPVPZoneAtXY).toHaveBeenCalled();
  });

  describe("Validation", () => {
    it("should throw an error if the NPC is dead", async () => {
      testNPC.isAlive = false;
      await testNPC.save();

      const result = await npcTarget.tryToSetTarget(testNPC);

      expect(result).toBeUndefined();
    });

    it("should throw an error if the NPC has no maxRangeInGridCells specified", async () => {
      testNPC.maxRangeInGridCells = undefined;
      await testNPC.save();

      await expect(npcTarget.tryToSetTarget(testNPC)).rejects.toThrowError(
        "NPC test-npc-22 is trying to set target, but no maxRangeInGridCells is specified (required for range)!"
      );
    });

    it("clears target if tries to set it but its out of range", async () => {
      const clearTarget = jest.spyOn(npcTarget, "clearTarget");

      testCharacter = await unitTestHelper.createMockCharacter({
        x: FromGridX(0),
        y: FromGridY(0),
      });

      await npcTarget.setTarget(testNPC, testCharacter);

      testCharacter.x = 999;
      testCharacter.y = 999;
      await testCharacter.save();

      testNPC = (await NPC.findById(testNPC.id)) as INPC;
      testCharacter = (await Character.findById(testCharacter.id)) as ICharacter;

      await npcTarget.tryToClearOutOfRangeTargets(testNPC);

      expect(clearTarget).toHaveBeenCalled();
    });
  });
});
