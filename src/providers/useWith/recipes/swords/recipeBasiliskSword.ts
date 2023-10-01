import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBasiliskSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.BasiliskSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 4,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 10],
};
