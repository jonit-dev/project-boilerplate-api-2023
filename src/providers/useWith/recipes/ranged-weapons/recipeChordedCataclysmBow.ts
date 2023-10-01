import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeChordedCataclysmBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.ChordedCataclysmBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenOre,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 40,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 34],
};
