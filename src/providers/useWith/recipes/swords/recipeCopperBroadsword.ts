import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCopperBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.CopperBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 10],
      [CraftingResourcesBlueprint.WoodenSticks, 2],
      [CraftingResourcesBlueprint.Leather, 1],
    ]),
  ],
};
