import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill, MagicsBlueprint } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeVioletVenomSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.VioletVenomSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 100,
    },
    {
      key: MagicsBlueprint.PoisonRune,
      qty: 100,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 34],
};
