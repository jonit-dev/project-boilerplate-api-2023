import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWolfTooth: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.WolfTooth,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/wolf-tooth.png",
  name: "Wolf Tooth",
  description: "A crafting material used as a magic reagent.",
  weight: 0.01,
  maxStackSize: 999,
  basePrice: 4,
};
