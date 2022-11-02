import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenIngot: Partial<IItem> = {
  key: CraftingResourcesBlueprint.GoldenIngot,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/golden-ingot.png",
  name: "Golden Ingot",
  description: "A precious metal and crafting resource.",
  weight: 1,
  maxStackSize: 100,
  sellPrice: 10,
};
