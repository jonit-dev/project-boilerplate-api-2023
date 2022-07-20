import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemSilverKey: Partial<IItem> = {
  key: "silver-key",
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "others/silver-key.png",
  textureKey: "accessories",
  name: "Silver Key",
  description: "a well made silver key.",
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
};
