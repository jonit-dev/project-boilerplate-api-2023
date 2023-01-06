import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLeviathanSword: Partial<IItem> = {
  key: SwordsBlueprint.LeviathanSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/leviathan-sword.png",
  name: "Leviathan Sword",
  description: "A mythical sword associated with the leviathan  a sea monster",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
