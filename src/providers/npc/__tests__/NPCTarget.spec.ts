/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, NPCTargetType, NPC_MAX_TALKING_DISTANCE_IN_GRID } from "@rpg-engine/shared";
import { NPCTarget } from "../movement/NPCTarget";

describe("NPCTarget.ts", () => {
  let npcTarget: NPCTarget;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    npcTarget = container.get<NPCTarget>(NPCTarget);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPC = await unitTestHelper.createMockNPC(
      {
        x: FromGridX(0),
        y: FromGridY(0),
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

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  it("should clear the target if character is out of range", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });

    await npcTarget.tryToSetTarget(testNPC);

    expect(testNPC.targetCharacter).toBeDefined();

    testCharacter.x = 999;
    testCharacter.y = 999;
    await testCharacter.save();

    await npcTarget.tryToClearOutOfRangeTargets(testNPC);

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  it("should clear the target if character logs out", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });

    await npcTarget.tryToSetTarget(testNPC);

    expect(testNPC.targetCharacter).toBeDefined();

    testCharacter.isOnline = false;
    await testCharacter.save();

    await npcTarget.tryToClearOutOfRangeTargets(testNPC);

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  it("should clear the target if character starts dialog near, but then go beyond max threshold", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });

    await npcTarget.tryToSetTarget(testNPC);

    expect(testNPC.targetCharacter).toBeDefined();
    expect(testNPC.targetCharacter?.toString()).toBe(testCharacter.id.toString());

    testNPC.targetType = NPCTargetType.Talking;
    await testNPC.save();

    testCharacter.x = FromGridX(NPC_MAX_TALKING_DISTANCE_IN_GRID - 1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();

    await npcTarget.tryToClearOutOfRangeTargets(testNPC);

    expect(testNPC.targetCharacter).toBeDefined();

    testCharacter.x = FromGridX(NPC_MAX_TALKING_DISTANCE_IN_GRID + 1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();

    await npcTarget.tryToClearOutOfRangeTargets(testNPC);

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
