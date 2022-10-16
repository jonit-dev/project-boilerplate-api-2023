import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { GlovesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPlateGloves: Partial<IItem> = {
  key: GlovesBlueprint.PlateGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/plate-gloves.png",

  name: "Plate Gloves",
  description: "A pair of plated gloves.",
  defense: 10,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.Ring],
};
