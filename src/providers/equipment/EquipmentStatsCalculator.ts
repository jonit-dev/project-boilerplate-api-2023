import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { IItem, ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(EquipmentStatsCalculator)
export class EquipmentStatsCalculator {
  constructor(private newRelic: NewRelic) {}

  public async getTotalEquipmentStats(equipmentId: string, type: "attack" | "defense"): Promise<number> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "EquipmentStatsCalculator.getTotalEquipmentStats",
      async () => {
        return await this.getTotalAttackOrDefense(equipmentId, type);
      }
    );
  }

  private async getTotalAttackOrDefense(equipmentId: string, type: "attack" | "defense"): Promise<number> {
    // TODO: Cache this
    const equipment = await Equipment.findById(equipmentId)
      .populate("head neck leftHand rightHand ring legs boot accessory armor inventory")
      .lean();

    if (equipment) {
      const head = equipment.head! as unknown as IItem;
      const neck = equipment.neck! as unknown as IItem;
      const leftHand = equipment.leftHand! as unknown as IItem;
      const rightHand = equipment.rightHand! as unknown as IItem;
      const ring = equipment.ring! as unknown as IItem;
      const legs = equipment.legs! as unknown as IItem;
      const boot = equipment.boot! as unknown as IItem;
      const accessory = equipment.accessory! as unknown as IItem;
      const armor = equipment.armor! as unknown as IItem;
      const inventory = equipment.inventory! as unknown as IItem;

      let equipmentSlots = [head, neck, leftHand, rightHand, ring, legs, boot, armor, inventory];

      if (type === "attack") {
        if (leftHand?.subType !== ItemSubType.Staff && leftHand?.subType === ItemSubType.Ranged) {
          equipmentSlots = [head, neck, leftHand, rightHand, ring, legs, boot, accessory, armor, inventory];
        }
        if (rightHand?.subType !== ItemSubType.Staff && rightHand?.subType === ItemSubType.Ranged) {
          equipmentSlots = [head, neck, leftHand, rightHand, ring, legs, boot, accessory, armor, inventory];
        }
      }

      let totalStats = 0;
      for (const equipment of equipmentSlots) {
        if (equipment && equipment?.[type]) {
          // @ts-ignore
          totalStats += equipment?.[type];
        }
      }

      return totalStats;
    }

    return 0;
  }
}
