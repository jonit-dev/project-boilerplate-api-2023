import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWolfTooth: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.WolfTooth,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/wolf-tooth.png",
  name: "Wolf Tooth",
  description: "A crafting material used as a magic reagent.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 0.5,
};
