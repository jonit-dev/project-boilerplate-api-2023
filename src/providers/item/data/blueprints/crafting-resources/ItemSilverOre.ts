import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSilverOre: Partial<IItem> = {
  key: CraftingResourcesBlueprint.SilverOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/silver-ore.png",
  name: "Silver Ore",
  description: "Silver ore that can be smelted into ingots.",
  weight: 2,
  maxStackSize: 100,
  hasUseWith: true,
};
