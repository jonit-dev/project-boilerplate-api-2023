import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  BooksBlueprint,
  CraftingResourcesBlueprint,
  MagicsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeStormbringerGrimoire: IUseWithCraftingRecipe = {
  outputKey: BooksBlueprint.StormbringerGrimoire,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
    {
      key: MagicsBlueprint.ThunderRune,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.MagicRecipe, 4],
      [CraftingResourcesBlueprint.ObsidiumOre, 3],
      [CraftingResourcesBlueprint.Leather, 5],
    ]),
  ],
};
