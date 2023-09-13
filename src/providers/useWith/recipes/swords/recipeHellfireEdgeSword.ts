import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeHellfireEdgeSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.HellfireEdgeSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 19,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 19,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 14,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 14,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionOre, 19],
      [CraftingResourcesBlueprint.RedSapphire, 19],
      [CraftingResourcesBlueprint.BlueSapphire, 14],
      [CraftingResourcesBlueprint.SteelIngot, 14],
    ]),
  ],
};
