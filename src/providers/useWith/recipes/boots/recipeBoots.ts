import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.Boots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 8,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 1],
};
