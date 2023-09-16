import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeHellfireEdgeSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.HellfireEdgeSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionIngot, 70],
      [CraftingResourcesBlueprint.RedSapphire, 100],
      [CraftingResourcesBlueprint.BlueSapphire, 100],
      [CraftingResourcesBlueprint.SteelIngot, 50],
    ]),
  ],
};
