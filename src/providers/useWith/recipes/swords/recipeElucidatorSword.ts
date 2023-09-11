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
      qty: 180,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 160,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 90,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 180],
      [CraftingResourcesBlueprint.CorruptionOre, 160],
      [CraftingResourcesBlueprint.WoodenBoard, 90],
    ]),
  ],
};
