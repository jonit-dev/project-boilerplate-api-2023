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
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 1,
    },
    {
      key: MagicsBlueprint.EnergyBoltRune,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.MagicRecipe, 2],
      [CraftingResourcesBlueprint.PhoenixFeather, 4],
      [CraftingResourcesBlueprint.DragonTooth, 1],
      [MagicsBlueprint.EnergyBoltRune, 2],
    ]),
  ],
};
