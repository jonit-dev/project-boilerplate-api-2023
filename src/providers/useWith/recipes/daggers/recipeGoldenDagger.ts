import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGoldenDagger: IUseWithCraftingRecipe = {
  outputKey: DaggersBlueprint.GoldenDagger,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 25,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 30],
      [CraftingResourcesBlueprint.Jade, 10],
      [CraftingResourcesBlueprint.PhoenixFeather, 20],
      [CraftingResourcesBlueprint.WoodenBoard, 25],
    ]),
  ],
};
