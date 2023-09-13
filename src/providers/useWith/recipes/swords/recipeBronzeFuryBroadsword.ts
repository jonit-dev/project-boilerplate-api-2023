import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBronzeFuryBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.BronzeFuryBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 13,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionOre, 5],
      [CraftingResourcesBlueprint.IronIngot, 5],
      [CraftingResourcesBlueprint.Leather, 13],
    ]),
  ],
};
