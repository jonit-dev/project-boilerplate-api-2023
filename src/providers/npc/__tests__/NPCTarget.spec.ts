/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
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
    testNPC = await unitTestHelper.createMockNPC({
      x: FromGridX(0),
      y: FromGridY(0),
    });
  });

  it("should properly get target direction", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(10),
      y: FromGridY(0),
    });

    const targetDirection = npcTarget.getTargetDirection(testNPC, testCharacter.x, testCharacter.y);

    expect(targetDirection).toBe("right");
  });

  it("should properly set a target to the closest player, if inside the NPC range", async () => {
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

  it("should not set a target, if player is out of range", async () => {
    await unitTestHelper.createMockCharacter({
      x: FromGridX(999),
      y: FromGridY(999),
    });

    await npcTarget.tryToSetTarget(testNPC);

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
