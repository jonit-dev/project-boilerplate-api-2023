import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeVortexStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.VortexStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 120,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 36],
};
