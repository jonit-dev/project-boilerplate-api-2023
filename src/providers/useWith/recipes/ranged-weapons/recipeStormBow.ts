import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeStormBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.StormBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 25,
    },
    {
      key: MagicsBlueprint.EnergyBoltRune,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 15,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 25],
};
