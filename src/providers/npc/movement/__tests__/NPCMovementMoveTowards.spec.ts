import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, mapLoader, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, NPCMovementType, NPCPathOrientation } from "@rpg-engine/shared";
import { NPCMovementMoveTowards } from "../NPCMovementMoveTowards";
import { NPCTarget } from "../NPCTarget";
describe("NPCMovementMoveTowards.ts", () => {
  let npcMovementMoveTowards: NPCMovementMoveTowards;
  let npcTarget: NPCTarget;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    npcMovementMoveTowards = container.get<NPCMovementMoveTowards>(NPCMovementMoveTowards);
    mapLoader.init();
    npcTarget = container.get<NPCTarget>(NPCTarget);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(14),
      y: FromGridY(12),
      initialX: FromGridX(14),
      initialY: FromGridY(12),
    });
    testNPC = await unitTestHelper.createMockNPC(
      {
        x: FromGridX(14),
        y: FromGridY(16),
        initialX: FromGridX(14),
        initialY: FromGridY(16),
      },
      NPCMovementType.MoveTowards
    );
  });

  afterEach(async () => {
    testNPC.targetCharacter = undefined;
    await testNPC.save();

    // reset NPC and character positions
    testNPC.x = FromGridX(14);
    testNPC.y = FromGridY(16);
    await testNPC.save();
    testCharacter.x = FromGridX(14);
    testCharacter.y = FromGridY(12);
    await testCharacter.save();
  });

  it("has target correctly set", async () => {
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

    expect(testNPC.targetCharacter?.toString()).toBe(testCharacter._id.toString());
  });

  it("should correctly move towards the target thats within a distance range, if orientation is forwards", async () => {
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

    expect(testNPC.x).toBe(FromGridX(13));
    expect(testNPC.y).toBe(FromGridY(15));
  });

  it("should correctly stop the movement if the target is reached", async () => {
    testNPC.x = FromGridX(14);
    testNPC.y = FromGridY(13);

    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

    expect(testNPC.x).toBe(FromGridX(14));
    expect(testNPC.y).toBe(FromGridY(13));
  });

  it("should correctly move back to the original position if target becomes out of range", async () => {
    testNPC.x = FromGridX(14);
    testNPC.y = FromGridY(24);
    testNPC.initialX = FromGridX(14);
    testNPC.initialY = FromGridY(24);
    await testNPC.save();
    testCharacter.x = FromGridX(14);
    testCharacter.y = FromGridY(17);
    await testCharacter.save();

    await npcTarget.tryToSetTarget(testNPC);
    expect(testNPC.targetCharacter?.toString()).toBe(testCharacter._id.toString());
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

    expect(testNPC.x).toBe(FromGridX(14));
    expect(testNPC.y).toBe(FromGridX(20));

    testNPC.x = FromGridX(20);
    testNPC.y = FromGridY(14);
    await testNPC.save();

    testCharacter.x = FromGridX(21);
    testCharacter.y = FromGridY(12);
    await testCharacter.save();

    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

    expect(testNPC.pathOrientation).toBe(NPCPathOrientation.Backward);
    expect(testNPC.x).toBe(FromGridX(20));
    expect(testNPC.y).toBe(FromGridX(14));
  });
  it("should correctly lose target if target is far away", async () => {
    testNPC.x = FromGridX(14);
    testNPC.y = FromGridX(24);
    await testNPC.save();
    testCharacter.x = FromGridX(50);
    testCharacter.y = FromGridY(9);
    await testCharacter.save();

    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

    expect(testNPC.targetCharacter).toBeUndefined();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
