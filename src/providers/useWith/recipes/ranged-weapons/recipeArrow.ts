import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.Arrow,
  outputQtyRange: [2, 5],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 2,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 1],
};
