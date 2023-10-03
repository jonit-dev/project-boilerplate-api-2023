import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeChainBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.ChainBoots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 25,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 24],
};
