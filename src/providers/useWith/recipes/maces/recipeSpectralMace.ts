import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSpectralMace: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.SpectralMace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 9,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 4,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 9],
      [CraftingResourcesBlueprint.BlueSapphire, 8],
      [CraftingResourcesBlueprint.BlueFeather, 4],
    ]),
  ],
};
