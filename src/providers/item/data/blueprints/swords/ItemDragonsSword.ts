import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemDragonsSword: Partial<IItem> = {
  key: "dragon's-sword",
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/dragon's-sword.png",
  textureKey: "dragon's-sword",
  name: "Dragon's Sword",
  description: "A mythical sword crafted from the claws and teeth of a fallen dragon to be yielded by a great warrior.",
  attack: 16,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
