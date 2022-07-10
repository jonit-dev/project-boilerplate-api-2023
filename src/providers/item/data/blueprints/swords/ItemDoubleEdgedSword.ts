import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemDoubleEdgedSword: Partial<IItem> = {
  key: "double-edged-sword",
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/double-edged-sword.png",
  textureKey: "double-edged-sword",
  name: "Double Edged Sword",
  description: "An iron sword sharpened on both sides with incredible edge.",
  attack: 4,
  defense: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
