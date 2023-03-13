import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenStaff: Partial<IItem> = {
  key: StaffsBlueprint.WoodenStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "staffs/wooden-staff.png",
  name: "Training Staff",
  description: "A long wooden pole used for ranged attacks or as a magical implement.",
  attack: 1,
  defense: 1,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 50,
  maxRange: 7,
  isTwoHanded: true,
  isTraining: true,
};
