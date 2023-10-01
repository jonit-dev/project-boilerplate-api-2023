import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeZenBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.ZenBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 160,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 37],
};
