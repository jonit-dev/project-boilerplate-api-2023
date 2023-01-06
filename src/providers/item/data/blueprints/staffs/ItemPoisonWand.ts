import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonWand: Partial<IMagicStaff> = {
  key: StaffsBlueprint.PoisonWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/poison-wand.png",
  name: "Poison Wand",
  description: "A wand or rod imbued with toxic or poisonous properties",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 8,
  defense: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
};
