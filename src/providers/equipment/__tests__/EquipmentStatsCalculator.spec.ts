import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EquipmentStatsCalculator } from "../EquipmentStatsCalculator";

describe("EquipmentStatsCalculator.spec.ts", () => {
  let equipmentStatsCalculator: EquipmentStatsCalculator;
  let equipment: IEquipment;

  beforeAll(async () => {
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
});
