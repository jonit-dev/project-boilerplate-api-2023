import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeStarsHooterBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.StarsHooterBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 110,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 120,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 39],
};
