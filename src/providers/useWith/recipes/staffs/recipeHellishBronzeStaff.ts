import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeHellishBronzeStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.HellishBronzeStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 10,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 38],
};
