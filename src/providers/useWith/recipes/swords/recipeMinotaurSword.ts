import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeMinotaurSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.MinotaurSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 130,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 35],
};
