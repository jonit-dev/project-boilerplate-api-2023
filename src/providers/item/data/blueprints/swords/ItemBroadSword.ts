import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBroadSword: Partial<IItem> = {
  key: SwordBlueprint.BroadSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/broad-sword.png",
  textureKey: "broad-sword",
  name: "Broad Sword",
  description: "A towering two-handed iron sword.",
  attack: 6,
  defense: 0,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
