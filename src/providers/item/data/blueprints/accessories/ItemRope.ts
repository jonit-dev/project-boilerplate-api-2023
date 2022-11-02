import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRope: Partial<IItem> = {
  key: AccessoriesBlueprint.Rope,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/rope.png",

  name: "Rope",
  description: "A simple rope.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  sellPrice: 5,
};
