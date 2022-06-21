import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(EquipmentStatsCalculator)
export class EquipmentStatsCalculator {
  public async getTotalEquipmentStats(equipmentId: string, type: "attack" | "defense"): Promise<number> {
    return await getTotalEquipmentStats(equipmentId, type);
  }
}

export const getEquipmentSet = async (equipmentId: string): Promise<object> => {
  const equipment = await Equipment.findById(equipmentId)
    .populate("head neck leftHand rightHand ring legs boot accessory armor inventory")
    .exec();

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

    const equipmentSlots = {
      head,
      neck,
      leftHand,
      rightHand,
      ring,
      legs,
      boot,
      accessory,
      armor,
      inventory,
    };

    return equipmentSlots;
  }

  return {};
};

export const getTotalEquipmentStats = async (equipmentId: string, type: "attack" | "defense"): Promise<number> => {
  const equipment = await Equipment.findById(equipmentId)
    .populate("head neck leftHand rightHand ring legs boot accessory armor inventory")
    .exec();

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

    const equipmentSlots = [head, neck, leftHand, rightHand, ring, legs, boot, accessory, armor, inventory];

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
};
