import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeHadesBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.HadesBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 7,
    },
    {
      key: MagicsBlueprint.DarkRune,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 17],
};
