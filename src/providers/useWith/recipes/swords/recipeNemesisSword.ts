import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeNemesisSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.NemesisSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.WeaponRecipe,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 100,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 35],
};
