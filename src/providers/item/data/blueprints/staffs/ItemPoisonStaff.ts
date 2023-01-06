import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.PoisonStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/poison-staff.png",
  name: "Poison Staff",
  description: "A staff or rod imbued with toxic or poisonous properties",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 15,
  defense: 2,
  rangeType: EntityAttackType.Ranged,
  basePrice: 85,
  maxRange: 3,
};
