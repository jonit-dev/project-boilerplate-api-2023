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
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.PhoenixFeather, 150],
      [CraftingResourcesBlueprint.GoldenIngot, 50],
      [CraftingResourcesBlueprint.WoodenBoard, 30],
      [CraftingResourcesBlueprint.DragonTooth, 3],
    ]),
  ],
};
