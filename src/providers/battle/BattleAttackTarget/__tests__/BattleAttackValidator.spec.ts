import { container, unitTestHelper } from "@providers/inversify/container";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { BattleAttackValidator } from "../BattleAttackValidator";

describe("battleAttackValidator.spec.ts", () => {
  let battleAttackValidator: BattleAttackValidator;
  let testCharacter: ICharacter;
  let testNPC: INPC;

  beforeAll(async () => {
    battleAttackValidator = container.get<BattleAttackValidator>(BattleAttackValidator);

    await unitTestHelper.initializeMapLoader();
  });

  const setupRangedCharacter = async (): Promise<void> => {
    const bow = await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow);
    const arrows = await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, {
      stackQty: 100,
    });

    const equipment = await Equipment.findById(testCharacter.equipment);

    if (!equipment) throw new Error("Equipment not found");
    equipment.leftHand = bow;
    equipment.accessory = arrows;
    await equipment?.save();
  };

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
      hasEquipment: true,
      hasInventory: true,
    });
    testNPC = await unitTestHelper.createMockNPC(
      {
        maxRangeAttack: 10,
      },
      { hasSkills: true }
    );
  });

  it("should validate a character's ranged attack", async () => {
    const target = await unitTestHelper.createMockCharacter();

    await setupRangedCharacter();

    const result = await battleAttackValidator.validateAttack(testCharacter, target);

    expect(result).toBeDefined();
  });

  it("should validate an NPC's ranged attack", async () => {
    const target = await unitTestHelper.createMockCharacter();
    const result = await battleAttackValidator.validateAttack(testNPC, target);

    expect(result).toBeDefined();
  });

  it("should validate a character's magic attack", async () => {
    const target = { targetId: testNPC.id, targetType: testNPC.type } as any;
    const result = await battleAttackValidator.validateMagicAttack(testCharacter._id, target);

    expect(result).toBeDefined();
  });

  it("should throw an error when validating an NPC's ranged attack without specifying maxRangeAttack", async () => {
    const target = await unitTestHelper.createMockCharacter();
    testNPC.maxRangeAttack = undefined;
    await testNPC.save();

    await expect(battleAttackValidator.validateAttack(testNPC, target)).rejects.toThrowError();
  });

  it("should return undefined when character has no ranged attack or ammo", async () => {
    const target = await unitTestHelper.createMockCharacter();

    // Set up the testCharacter without ranged attack or ammo

    const result = await battleAttackValidator.validateAttack(testCharacter, target);

    expect(result).toBeUndefined();
  });

  it("should return undefined when the target is out of range", async () => {
    const target = await unitTestHelper.createMockCharacter({
      x: 9999,
      y: 9999,
    });

    await setupRangedCharacter();

    const result = await battleAttackValidator.validateAttack(testCharacter, target);

    expect(result).toBeUndefined();
  });

  it("should return undefined when there's a solid in the ranged attack trajectory", async () => {
    const target = await unitTestHelper.createMockCharacter();

    await setupRangedCharacter();

    // @ts-ignore
    const sendSolidTrajectoryEvent = jest.spyOn(battleAttackValidator, "sendSolidInTrajectoryEvent");

    // @ts-ignore
    jest.spyOn(battleAttackValidator.battleRangedAttack, "isSolidInRangedTrajectory").mockImplementation(() => true);

    const result = await battleAttackValidator.validateAttack(testCharacter, target);

    expect(sendSolidTrajectoryEvent).toHaveBeenCalled();

    expect(sendSolidTrajectoryEvent).toHaveBeenCalledWith(testCharacter, target);

    expect(result).toBeUndefined();
  });
});
