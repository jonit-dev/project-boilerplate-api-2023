import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipePhoenixSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.PhoenixSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 12,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 37],
};
