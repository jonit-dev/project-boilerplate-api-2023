import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeLifePotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.LifePotion,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Herb, 4],
      [CraftingResourcesBlueprint.WaterBottle, 2],
    ]),
  ],
};
