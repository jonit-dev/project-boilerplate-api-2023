import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeUmbralBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.UmbralBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 140,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 40],
};
