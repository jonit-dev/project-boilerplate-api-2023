import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLeather: Partial<IItem> = {
  key: CraftingResourcesBlueprint.Leather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/leather.png",
  name: "Leather",
  description: "Raw material that can be used to craft armors and other goods",
  weight: 3,
  maxStackSize: 100,
  basePrice: 0.5,
  hasUseWith: true,
};
