import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { IEquipmentSet, ItemSlotType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentTwoHanded)
export class EquipmentTwoHanded {
  constructor(private equipmentSlots: EquipmentSlots) {}

  public async hasTwoHandedItemEquipped(equipment: IEquipmentSet): Promise<boolean> {
    const leftHandItem = await Item.findById(equipment.leftHand);
    const rightHandItem = await Item.findById(equipment.rightHand);

    if (leftHandItem?.isTwoHanded || rightHandItem?.isTwoHanded) {
      return true;
    }
    return false;
  }

  public async checkTwoHandedEquip(equipment: IEquipmentSet): Promise<boolean> {
    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);
    if (!equipmentSlots.leftHand && !equipmentSlots.rightHand) return true;

    return false;
  }

  public isItemEquippableOnHands(item: IItem): boolean {
    return !!(
      item.allowedEquipSlotType?.includes(ItemSlotType.LeftHand) ||
      item.allowedEquipSlotType?.includes(ItemSlotType.RightHand)
    );
  }
}
