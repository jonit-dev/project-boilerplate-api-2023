import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSoulStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.SoulStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/soul-staff.png",
  name: "Soul Staff",
  description: "A staff or rod associated with the soul or spirit, often used in spells or rituals",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 10,
  defense: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 55,
};
