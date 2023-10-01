import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGrandSanguineBattleaxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.GrandSanguineBattleaxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 45,
    },
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 50,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 36],
};
