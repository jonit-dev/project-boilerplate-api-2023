import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCenturionBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.CenturionBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 18,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 9,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 8,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 18],
      [CraftingResourcesBlueprint.Skull, 9],
      [CraftingResourcesBlueprint.Leather, 8],
    ]),
  ],
};
