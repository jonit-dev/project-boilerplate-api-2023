import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemGreaterLifePotion: Partial<IItem> = {
  key: "greater-life-potion",
  type: ItemType.Consumable,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "potions/greater-life-potion.png",
  textureKey: "greater-life-potion",
  name: "Greater Life Potion",
  description: "A flask containing deep red liquid of a greater elixir of life.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
