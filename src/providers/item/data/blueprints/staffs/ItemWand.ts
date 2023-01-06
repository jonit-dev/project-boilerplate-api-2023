import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWand: Partial<IMagicStaff> = {
  key: StaffsBlueprint.Wand,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/wand.png",
  name: "Wand",
  description: "A magic wand, crafted by the dark lord Sauron",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 5,
  defense: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
};
