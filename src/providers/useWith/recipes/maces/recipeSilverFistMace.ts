import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSilverFistMace: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.SilverFistMace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 60,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 28],
};
