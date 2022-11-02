import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueFeather: Partial<IItem> = {
  key: CraftingResourcesBlueprint.BlueFeather,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/blue-feather.png",

  name: "Blue Feather",
  description: "A craft material used to make arrows.",
  weight: 0.1,
  maxStackSize: 100,
  sellPrice: 10,
};
