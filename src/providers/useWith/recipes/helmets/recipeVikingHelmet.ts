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
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.WolfTooth,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 5],
      [CraftingResourcesBlueprint.WolfTooth, 5],
      [CraftingResourcesBlueprint.Leather, 10],
      [CraftingResourcesBlueprint.Skull, 5],
    ]),
  ],
};
