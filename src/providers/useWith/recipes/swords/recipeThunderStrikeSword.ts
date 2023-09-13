import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeThunderStrikeSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.ThunderStrikeSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 17,
    },
    {
      key: CraftingResourcesBlueprint.Rock,
      qty: 18,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 15,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionOre, 17],
      [CraftingResourcesBlueprint.Rock, 18],
      [CraftingResourcesBlueprint.Leather, 15],
    ]),
  ],
};
