import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeRubyStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.FireStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.RedSapphire, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 3],
      [CraftingResourcesBlueprint.GreenIngot, 3],
    ]),
  ],
};
