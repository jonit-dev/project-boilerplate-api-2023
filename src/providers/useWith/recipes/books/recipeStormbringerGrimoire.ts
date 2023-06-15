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
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 4,
    },
    {
      key: MagicsBlueprint.ThunderRune,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.MagicRecipe, 2],
      [CraftingResourcesBlueprint.DragonTooth, 2],
      [CraftingResourcesBlueprint.Leather, 4],
      [MagicsBlueprint.ThunderRune, 2],
    ]),
  ],
};
