import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  ShieldsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeDarkShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.DarkShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: MagicsBlueprint.DarkRune,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionIngot, 20],
      [CraftingResourcesBlueprint.Eye, 20],
      [CraftingResourcesBlueprint.DragonTooth, 2],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 5],
      [CraftingResourcesBlueprint.MagicRecipe, 5],
    ]),
  ],
};
