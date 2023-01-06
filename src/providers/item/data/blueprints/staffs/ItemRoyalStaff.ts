import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.RoyalStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/royal-staff.png",
  name: "Royal Staff",
  description: "A staff associated with royalty or nobility",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 10,
  defense: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 90,
};
