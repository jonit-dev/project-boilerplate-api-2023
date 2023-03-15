import { IEquippableItemBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BooksBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBook: IEquippableItemBlueprint = {
  key: BooksBlueprint.Book,
  type: ItemType.Accessory,
  subType: ItemSubType.Book,
  textureAtlas: "items",
  texturePath: "books/book.png",
  name: "Book",
  description: "A leather bound book.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 1,
};
