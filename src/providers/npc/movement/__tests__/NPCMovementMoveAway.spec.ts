import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, NPCMovementType } from "@rpg-engine/shared";
import { NPCMovementMoveAway } from "../NPCMovementMoveAway";
import { NPCTarget } from "../NPCTarget";
describe("NPCMovementMoveAway.ts", () => {
  let npcMovementMoveAway: NPCMovementMoveAway;
  let testNPC: INPC;
  let testCharacter: ICharacter;
  let npcTarget: NPCTarget;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    npcMovementMoveAway = container.get<NPCMovementMoveAway>(NPCMovementMoveAway);
    npcTarget = container.get<NPCTarget>(NPCTarget);
    await unitTestHelper.initializeMapLoader();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(22),
      y: FromGridY(9),
      initialX: FromGridX(22),
      initialY: FromGridY(9),
    });
    testNPC = await unitTestHelper.createMockNPC(
      {
        x: FromGridX(28),
        y: FromGridY(9),
        initialX: FromGridX(28),
        initialY: FromGridY(9),
      },
      { hasSkills: true },
      NPCMovementType.MoveAway
    );
    await npcTarget.tryToSetTarget(testNPC);
  });

  it("should correctly set the target on the nearest character", async () => {
    testNPC = (await NPC.findById(testNPC._id)) as INPC;

    expect(testNPC.targetCharacter?.toString()).toBe(testCharacter._id.toString());
  });

  it("should move away from the target", async () => {
    testNPC = (await NPC.findById(testNPC._id)) as INPC;
    await npcMovementMoveAway.startMovementMoveAway(testNPC);
    testNPC = (await NPC.findById(testNPC._id)) as INPC;

    expect(testNPC.x).toBe(FromGridX(29));
    expect(testNPC.y).toBe(FromGridY(9));
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
