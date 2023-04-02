import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EquipmentStatsCalculator } from "../EquipmentStatsCalculator";
import { DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";

describe("EquipmentStatsCalculator.spec.ts", () => {
  let equipmentStatsCalculator: EquipmentStatsCalculator;
  let equipment: IEquipment;

  beforeAll(() => {
    equipmentStatsCalculator = container.get<EquipmentStatsCalculator>(EquipmentStatsCalculator);
  });

  beforeEach(async () => {
    equipment = await unitTestHelper.createEquipment();
  });

  it("should properly get total attack", async () => {
    const result = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");

    expect(result).toBe(18);
  });

  it("should properly get total defense", async () => {
    const result = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "defense");

    expect(result).toBe(16);
  });

  it("should properly get total attack - one one-handed weapon", async () => {
    const dagger = await unitTestHelper.createMockItemFromBlueprint(DaggersBlueprint.Dagger);
    equipment.leftHand = dagger._id;
    await equipment.save();

    const result = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");

    expect(result).toBe(21);
  });

  it("should properly get total attack - two one-handed weapons", async () => {
    const dagger1 = await unitTestHelper.createMockItemFromBlueprint(DaggersBlueprint.Dagger);
    equipment.leftHand = dagger1._id;
    const dagger2 = await unitTestHelper.createMockItemFromBlueprint(DaggersBlueprint.Dagger);
    equipment.rightHand = dagger2._id;
    await equipment.save();

    const result = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");

    expect(result).toBe(29);
  });
});
