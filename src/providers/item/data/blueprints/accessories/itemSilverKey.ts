import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSilverKey: Partial<IItem> = {
  key: AccessoriesBlueprint.SilverKey,
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
