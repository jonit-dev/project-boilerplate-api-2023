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
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 80],
      [CraftingResourcesBlueprint.IronNail, 60],
      [CraftingResourcesBlueprint.WoodenBoard, 50],
    ]),
  ],
};
