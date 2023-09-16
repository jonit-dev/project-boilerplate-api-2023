import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill, MagicsBlueprint } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeThunderStrikeSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.ThunderStrikeSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 50,
    },
    {
      key: MagicsBlueprint.ThunderRune,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionIngot, 50],
      [MagicsBlueprint.ThunderRune, 100],
      [CraftingResourcesBlueprint.WoodenBoard, 50],
    ]),
  ],
};
