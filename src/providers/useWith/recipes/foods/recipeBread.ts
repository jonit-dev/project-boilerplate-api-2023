import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBread: IUseWithCraftingRecipe = {
  outputKey: FoodsBlueprint.Bread,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Wheat,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Cooking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Wheat, 5],
      [CraftingResourcesBlueprint.WaterBottle, 3],
    ]),
  ],
};
