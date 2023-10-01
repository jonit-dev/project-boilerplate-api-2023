import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeHellfireEdgeSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.HellfireEdgeSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 120,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 36],
};
