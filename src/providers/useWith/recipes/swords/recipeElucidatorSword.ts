import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeElucidatorSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.ElucidatorSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 18,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 16,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 9,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 18],
      [CraftingResourcesBlueprint.CorruptionOre, 16],
      [CraftingResourcesBlueprint.Leather, 9],
    ]),
  ],
};
