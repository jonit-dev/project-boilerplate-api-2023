import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueSapphire: Partial<IItem> = {
  key: CraftingResourcesBlueprint.BlueSapphire,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/blue-sapphire.png",

  name: "Blue Sapphire",
  description: "Sapphire is a precious gemstone, formed from a mineral called corundum.",
  weight: 0.1,
  maxStackSize: 10,
  sellPrice: 10,
};
