import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSunstoneBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.SunstoneBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: MagicsBlueprint.EnergyBoltRune,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Rope, 3],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 5],
      [CraftingResourcesBlueprint.MagicRecipe, 10],
      [CraftingResourcesBlueprint.PolishedStone, 10],
      [CraftingResourcesBlueprint.DragonTooth, 2],
    ]),
  ],
};
