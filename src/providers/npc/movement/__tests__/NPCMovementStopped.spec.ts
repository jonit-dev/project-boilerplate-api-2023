import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, NPCMovementType } from "@rpg-engine/shared";
import { NPCMovementStopped } from "../NPCMovementStopped";
import { NPCTarget } from "../NPCTarget";

describe("NPCMovementStopped.ts", () => {
  let npcMovementStopped: NPCMovementStopped;
  let npcTarget: NPCTarget;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    npcMovementStopped = container.get<NPCMovementStopped>(NPCMovementStopped);
    npcTarget = container.get<NPCTarget>(NPCTarget);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPC = await unitTestHelper.createMockNPC(
      {
        x: FromGridX(0),
        y: FromGridY(0),
      },
      NPCMovementType.Stopped
    );
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(2),
      y: FromGridY(0),
    });
  });

  it("should properly set a new target once a player is close", async () => {
    await npcMovementStopped.startMovementStopped(testNPC);

    expect(testNPC.targetCharacter?.toString()).toBe(testCharacter.id.toString());
  });

  it("should properly face the direction towards the character", async () => {
    const mockedPositions = [
      { gridX: 2, gridY: 0, expectedResult: "right" },
      { gridX: 0, gridY: 2, expectedResult: "down" },
      { gridX: -2, gridY: 0, expectedResult: "left" },
      { gridX: 0, gridY: -2, expectedResult: "up" },
    ];

    for (const position of mockedPositions) {
      testCharacter.x = FromGridX(position.gridX);
      testCharacter.y = FromGridY(position.gridY);
      await testCharacter.save();

      await npcTarget.tryToSetTarget(testNPC);
      await npcMovementStopped.startMovementStopped(testNPC);
      expect(testNPC.direction).toBe(position.expectedResult);
    }
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});