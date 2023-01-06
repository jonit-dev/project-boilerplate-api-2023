import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireWand: Partial<IMagicStaff> = {
  key: StaffsBlueprint.FireWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/fire-wand.png",
  name: "Fire Wand",
  description: "A wand or rod that can generate or control flames",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 5,
  defense: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
