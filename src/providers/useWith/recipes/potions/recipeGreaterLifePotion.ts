import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGreaterLifePotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.GreaterLifePotion,
  outputQtyRange: [1, 2],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 7,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreaterWoodenLog, 2],
      [CraftingResourcesBlueprint.Leather, 1],
      [CraftingResourcesBlueprint.BatsWing, 1],
    ]),
  ],
};
