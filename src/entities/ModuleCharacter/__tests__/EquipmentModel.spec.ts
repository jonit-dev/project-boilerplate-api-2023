import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EquipmentStatsCalculator } from "@providers/equipment/EquipmentStatsCalculator";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  RangedWeaponsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { Equipment } from "../EquipmentModel";

describe("EquipmentModel.ts", () => {
  let testCharacter: ICharacter;
  let equipmentStatsCalculator: EquipmentStatsCalculator;

  beforeAll(() => {
    equipmentStatsCalculator = container.get<EquipmentStatsCalculator>(EquipmentStatsCalculator);
  });

  beforeEach(async () => {
    testCharacter = await await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
    });
  });

  it("Properly calculates attack [ Sword/Arrow ]", async () => {
    const equipment = await Equipment.findOne({
      owner: testCharacter._id,
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const testSword = await unitTestHelper.createMockItem();
    const testAccessoryArrow = await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow);

    equipment.leftHand = testSword;
    equipment.accessory = testAccessoryArrow;
    equipment.markModified("leftHand");
    equipment.markModified("accessory");
    await equipment.save();

    const statsCalculator = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");

    expect(statsCalculator).toBe(5);
  });

  it("Properly calculates attack [ Sword/Sword/Arror ]", async () => {
    const equipment = await Equipment.findOne({
      owner: testCharacter._id,
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const testSword = await unitTestHelper.createMockItem();
    const testAccessoryArrow = await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow);

    equipment.leftHand = testSword;
    equipment.rightHand = testSword;
    equipment.accessory = testAccessoryArrow;
    equipment.markModified("leftHand");
    equipment.markModified("rightHand");
    equipment.markModified("accessory");
    await equipment.save();

    const statsCalculator = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");

    expect(statsCalculator).toBe(10);
  });

  it("Properly calculates attack [ Bow/Arror ]", async () => {
    const equipment = await Equipment.findOne({
      owner: testCharacter._id,
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const testAccessoryArrow = await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow);
    const testBow = await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow);

    equipment.leftHand = testBow;
    equipment.accessory = testAccessoryArrow;
    equipment.markModified("leftHand");
    equipment.markModified("accessory");
    await equipment.save();

    const statsCalculator = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");

    expect(statsCalculator).toBe(17);
  });

  it("Properly calculates attack [ Staff/Arrow ]", async () => {
    const equipment = await Equipment.findOne({
      owner: testCharacter._id,
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const testAccessoryArrow = await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow);
    const testStaff = await unitTestHelper.createMockItemFromBlueprint(StaffsBlueprint.FireStaff);

    equipment.leftHand = testStaff;
    equipment.accessory = testAccessoryArrow;
    equipment.markModified("leftHand");
    equipment.markModified("accessory");
    await equipment.save();

    const statsCalculator = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");

    expect(statsCalculator).toBe(15);
  });

  it("Properly calculates defense ", async () => {
    const equipment = await Equipment.findOne({
      owner: testCharacter._id,
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const testArmor = await unitTestHelper.createMockItemFromBlueprint(ArmorsBlueprint.GoldenArmor);
    const testBoots = await unitTestHelper.createMockItemFromBlueprint(BootsBlueprint.GoldenBoots);

    equipment.armor = testArmor;
    equipment.boot = testBoots;
    equipment.markModified("armor");
    equipment.markModified("boot");
    await equipment.save();

    const statsCalculator = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "defense");

    expect(statsCalculator).toBe(54);
  });
});
