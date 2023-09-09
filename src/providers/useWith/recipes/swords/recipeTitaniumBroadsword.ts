import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTitaniumBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.TitaniumBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Rock,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 11,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 10],
      [CraftingResourcesBlueprint.Rock, 8],
      [CraftingResourcesBlueprint.Leather, 11],
    ]),
  ],
};
