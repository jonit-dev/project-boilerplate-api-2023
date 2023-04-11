import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCorruptionSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.CorruptionSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 6,
    },
    {
      key: MagicsBlueprint.CorruptionRune,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionIngot, 3],
      [CraftingResourcesBlueprint.SilverIngot, 6],
      [CraftingResourcesBlueprint.MagicRecipe, 5],
    ]),
  ],
};
