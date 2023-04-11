import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeHasteRing: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.HasteRing,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSapphire, 3],
      [CraftingResourcesBlueprint.PhoenixFeather, 1],
      [CraftingResourcesBlueprint.MagicRecipe, 2],
    ]),
  ],
};
