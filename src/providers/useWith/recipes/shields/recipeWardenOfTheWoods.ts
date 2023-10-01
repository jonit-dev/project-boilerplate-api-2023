import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeWardenOfTheWoods: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.WardenOfTheWoods,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 20,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 32],
};
