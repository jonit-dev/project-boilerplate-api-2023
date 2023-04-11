import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeVikingHelmet: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.VikingHelmet,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.WolfTooth,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 3],
      [CraftingResourcesBlueprint.WolfTooth, 2],
      [CraftingResourcesBlueprint.Leather, 2],
      [CraftingResourcesBlueprint.Skull, 2],
    ]),
  ],
};
