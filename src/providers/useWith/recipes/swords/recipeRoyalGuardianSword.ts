import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeRoyalGuardianSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.RoyalGuardianSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 19,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 17,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 20],
      [CraftingResourcesBlueprint.RedSapphire, 19],
      [CraftingResourcesBlueprint.Leather, 17],
    ]),
  ],
};
