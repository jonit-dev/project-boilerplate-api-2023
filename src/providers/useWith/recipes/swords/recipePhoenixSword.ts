import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipePhoenixSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.PhoenixSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 11,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 13,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.PhoenixFeather, 15],
      [CraftingResourcesBlueprint.GoldenIngot, 5],
      [CraftingResourcesBlueprint.Leather, 11],
      [CraftingResourcesBlueprint.DragonTooth, 13],
    ]),
  ],
};
