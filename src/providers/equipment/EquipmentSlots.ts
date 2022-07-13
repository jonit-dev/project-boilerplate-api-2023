import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IEquipmentSet, IItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(EquipmentSlots)
export class EquipmentSlots {
  public async getEquipmentSlots(equipmentId: string): Promise<IEquipmentSet> {
    const equipment = await Equipment.findById(equipmentId)
      .lean()
      .populate("head neck leftHand rightHand ring legs boot accessory armor inventory")
      .exec();

    const head = equipment?.head! as unknown as IItem;
    const neck = equipment?.neck! as unknown as IItem;
    const leftHand = equipment?.leftHand! as unknown as IItem;
    const rightHand = equipment?.rightHand! as unknown as IItem;
    const ring = equipment?.ring! as unknown as IItem;
    const legs = equipment?.legs! as unknown as IItem;
    const boot = equipment?.boot! as unknown as IItem;
    const accessory = equipment?.accessory! as unknown as IItem;
    const armor = equipment?.armor! as unknown as IItem;
    const inventory = equipment?.inventory! as unknown as IItem;

    return {
      _id: equipment!._id,
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
    } as IEquipmentSet;
  }
}
