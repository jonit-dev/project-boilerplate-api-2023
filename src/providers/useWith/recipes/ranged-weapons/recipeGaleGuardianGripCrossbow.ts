import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGaleGuardianGripCrossbow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.GaleGuardianGripCrossbow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 60,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 32],
};
