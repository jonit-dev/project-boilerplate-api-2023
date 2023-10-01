import { CraftingResourcesBlueprint, GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeEtherealEmbrace: IUseWithCraftingRecipe = {
  outputKey: GlovesBlueprint.EtherealEmbrace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 80,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 30],
};
