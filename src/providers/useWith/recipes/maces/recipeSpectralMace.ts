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
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 40,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 90],
      [CraftingResourcesBlueprint.BlueSapphire, 80],
      [CraftingResourcesBlueprint.BlueFeather, 40],
      [CraftingResourcesBlueprint.CorruptionIngot, 40],
    ]),
  ],
};
