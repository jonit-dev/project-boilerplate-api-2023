import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeEmeraldBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.EmeraldBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 15,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 37],
};
