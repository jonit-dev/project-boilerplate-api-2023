import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { GlovesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLeatherGloves: Partial<IItem> = {
  key: GlovesBlueprint.LeatherGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/leather-gloves.png",

  name: "Leather Gloves",
  description: "A pair of simple leather gloves.",
  defense: 2,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 33,
};
