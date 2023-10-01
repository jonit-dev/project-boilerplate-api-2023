import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeParallelPrecisionBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.ParallelPrecisionBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 40,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 28],
};
