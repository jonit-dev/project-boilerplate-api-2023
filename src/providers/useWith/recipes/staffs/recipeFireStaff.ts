import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeFireStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.FireStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.RedSapphire, 4],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 3],
      [CraftingResourcesBlueprint.SteelIngot, 3],
    ]),
  ],
};
