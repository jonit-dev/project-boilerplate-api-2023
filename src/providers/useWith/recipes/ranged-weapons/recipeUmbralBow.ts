import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeUmbralBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.UmbralBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 100,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 80],
      [CraftingResourcesBlueprint.BlueSapphire, 100],
      [CraftingResourcesBlueprint.Silk, 100],
    ]),
  ],
};
