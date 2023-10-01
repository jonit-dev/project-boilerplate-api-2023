import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  BooksBlueprint,
  CraftingResourcesBlueprint,
  MagicsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeArcaneArbiterChronicles: IUseWithCraftingRecipe = {
  outputKey: BooksBlueprint.ArcaneArbiterChronicles,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GoldenOre,
      qty: 3,
    },
    {
      key: MagicsBlueprint.EnergyBoltRune,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.MagicRecipe, 5],
      [CraftingResourcesBlueprint.PhoenixFeather, 3],
      [CraftingResourcesBlueprint.GoldenOre, 3],
    ]),
  ],
};
