import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  AxesBlueprint,
  CraftingResourcesBlueprint,
  MagicsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeShadowAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.ShadowAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: MagicsBlueprint.CorruptionRune,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionIngot, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 5],
      [CraftingResourcesBlueprint.MagicRecipe, 5],
    ]),
  ],
};
