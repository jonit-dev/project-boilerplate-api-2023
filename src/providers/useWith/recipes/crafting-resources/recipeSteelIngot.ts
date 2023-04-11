import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSteelIngot: IUseWithCraftingRecipe = {
  outputKey: CraftingResourcesBlueprint.SteelIngot,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Mining,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 10],
      [CraftingResourcesBlueprint.CopperIngot, 10],
    ]),
  ],
};
