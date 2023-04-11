import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeRuneBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.RuneBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 5,
    },
    {
      key: MagicsBlueprint.CorruptionRune,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Rope, 5],
      [CraftingResourcesBlueprint.MagicRecipe, 5],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 5],
    ]),
  ],
};
