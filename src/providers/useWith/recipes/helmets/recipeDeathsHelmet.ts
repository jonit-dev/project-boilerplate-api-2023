import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeDeathsHelmet: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.DeathsHelmet,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 6],
      [CraftingResourcesBlueprint.ObsidiumOre, 2],
      [CraftingResourcesBlueprint.CorruptionOre, 3],
    ]),
  ],
};
