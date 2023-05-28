import { ContainersBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBag: IUseWithCraftingRecipe = {
  outputKey: ContainersBlueprint.Bag,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 1],
};
