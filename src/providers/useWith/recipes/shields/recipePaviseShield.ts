import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  ShieldsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipePaviseShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.PaviseShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.ColoredFeather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: MagicsBlueprint.HealRune,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 20],
      [CraftingResourcesBlueprint.ColoredFeather, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 5],
      [CraftingResourcesBlueprint.MagicRecipe, 5],
    ]),
  ],
};
