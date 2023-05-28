import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeRope: IUseWithCraftingRecipe = {
  outputKey: CraftingResourcesBlueprint.Rope,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 1],
};
