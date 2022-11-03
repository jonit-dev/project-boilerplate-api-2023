import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBook: Partial<IItem> = {
  key: MagicsBlueprint.Book,
  type: ItemType.Accessory,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/book.png",

  name: "Book",
  description: "A leather bound book.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  sellPrice: 10,
};
