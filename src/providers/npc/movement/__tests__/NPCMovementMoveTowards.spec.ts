import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, NPCAlignment, NPCMovementType, NPCPathOrientation } from "@rpg-engine/shared";
import { NPCMovementMoveTowards } from "../NPCMovementMoveTowards";
import { NPCTarget } from "../NPCTarget";
describe("NPCMovementMoveTowards.ts", () => {
  let npcMovementMoveTowards: NPCMovementMoveTowards;
  let npcTarget: NPCTarget;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    npcMovementMoveTowards = container.get<NPCMovementMoveTowards>(NPCMovementMoveTowards);
    await unitTestHelper.initializeMapLoader();
    npcTarget = container.get<NPCTarget>(NPCTarget);
  });

  beforeEach(async () => {
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
      { hasSkills: true },
      NPCMovementType.MoveTowards
    );
  });

  afterEach(async () => {
    await npcTarget.clearTarget(testNPC);

    // reset NPC and character positions
    testNPC.x = FromGridX(14);
    testNPC.y = FromGridY(16);
    await testNPC.save();
    testCharacter.x = FromGridX(14);
    testCharacter.y = FromGridY(12);
    await testCharacter.save();

    testNPC = (await NPC.findById(testNPC._id)) as INPC;
    testCharacter = (await Character.findById(testCharacter._id)) as ICharacter;
  });

  it("has target correctly set", async () => {
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

    const updatedTestNPC = await NPC.findById(testNPC._id);

    expect(updatedTestNPC?.targetCharacter?.toString()).toBe(testCharacter._id.toString());
  });

  it("should correctly move towards the target thats within a distance range, if orientation is forwards", async () => {
    testNPC = (await NPC.findById(testNPC._id)) as INPC;
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    testNPC = (await NPC.findById(testNPC._id)) as INPC;
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    testNPC = (await NPC.findById(testNPC._id)) as INPC;
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    testNPC = (await NPC.findById(testNPC._id)) as INPC;

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
    testNPC.maxAntiLuringRangeInGridCells = 5;
    await testNPC.save();
    testCharacter.x = FromGridX(14);
    testCharacter.y = FromGridY(17);
    await testCharacter.save();

    testNPC = (await NPC.findById(testNPC._id)) as INPC;
    testCharacter = (await Character.findById(testCharacter._id)) as ICharacter;

    // set target to character
    await npcTarget.tryToSetTarget(testNPC);

    testNPC = (await NPC.findById(testNPC._id)) as INPC;

    expect(testNPC?.targetCharacter?.toString()).toBe(testCharacter._id.toString());
    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    testNPC = (await NPC.findById(testNPC._id)) as INPC;

    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    testNPC = (await NPC.findById(testNPC._id)) as INPC;

    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    testNPC = (await NPC.findById(testNPC._id)) as INPC;

    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);
    testNPC = (await NPC.findById(testNPC._id)) as INPC;

    expect(testNPC.x).toBe(FromGridX(14));
    expect(testNPC.y).toBe(FromGridX(20));

    testNPC.x = FromGridX(20);
    testNPC.y = FromGridY(14);
    await testNPC.save();

    testCharacter = (await Character.findById(testCharacter._id)) as ICharacter;

    testCharacter.x = FromGridX(21);
    testCharacter.y = FromGridY(12);
    await testCharacter.save();

    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

    testNPC = (await NPC.findById(testNPC._id)) as INPC;

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

  it("should update NPC movement type to MoveAway if NPC has low health and fleeOnLowHealth is set to true", async () => {
    testNPC.health = 10;
    testNPC.maxHealth = 100;
    testNPC.currentMovementType = NPCMovementType.MoveTowards;
    testNPC.targetCharacter = testCharacter._id;
    testNPC.fleeOnLowHealth = true;
    await testNPC.save();

    await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

    const updatedNPC = await NPC.findById(testNPC._id);

    expect(updatedNPC?.currentMovementType).toEqual(NPCMovementType.MoveAway);
  });

  describe("Validation", () => {
    it("should correctly call this.initBattleCycle(npc)", async () => {
      testNPC.alignment = NPCAlignment.Hostile;
      testNPC.targetCharacter = testCharacter._id;
      await testNPC.save();

      testCharacter.x = FromGridX(14);
      testCharacter.y = FromGridY(15);
      await testCharacter.save();

      //  @ts-ignore
      const spy = jest.spyOn(npcMovementMoveTowards, "initBattleCycle");

      await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

      expect(spy).toHaveBeenCalledWith(testNPC);
    });

    describe("NPCMovementMoveTowards", () => {
      it("should call faceTarget if reachedTarget is true", async () => {
        testNPC.alignment = NPCAlignment.Hostile;
        testNPC.targetCharacter = testCharacter._id;
        await testNPC.save();

        testCharacter.x = FromGridX(14);
        testCharacter.y = FromGridY(15);
        await testCharacter.save();

        // mock faceTarget function
        // @ts-ignore
        npcMovementMoveTowards.faceTarget = jest.fn();

        // act
        await npcMovementMoveTowards.startMoveTowardsMovement(testNPC);

        // assert
        // @ts-ignore
        expect(npcMovementMoveTowards.faceTarget).toHaveBeenCalledWith(
          testNPC,
          expect.objectContaining({
            _id: testCharacter._id,
          })
        );
      });
    });

    describe("when reachedTarget...", () => {
      it("sets the npc.pathOrientation to NPCPathOrientation.Forward when reaching the target, if previous pathOrientation was NPCPathOrientation.Forward", async () => {
        testNPC.pathOrientation = NPCPathOrientation.Forward;
        testNPC.x = testCharacter.x;
        testNPC.y = testCharacter.y;
        await testNPC.save();

        // @ts-ignore
        npcMovementMoveTowards.reachedTarget(testNPC, testCharacter);

        expect(testNPC.pathOrientation).toBe(NPCPathOrientation.Forward);
      });
    });
  });
});
