import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeAzureDagger: IUseWithCraftingRecipe = {
  outputKey: DaggersBlueprint.AzureDagger,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 15],
      [CraftingResourcesBlueprint.BlueSapphire, 5],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 10],
    ]),
  ],
};
