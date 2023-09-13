import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBladeBarrier: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.BladeBarrier,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 8],
      [CraftingResourcesBlueprint.IronNail, 6],
      [CraftingResourcesBlueprint.Leather, 5],
    ]),
  ],
};
