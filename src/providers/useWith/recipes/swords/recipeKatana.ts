import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeKatana: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.Katana,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 2],
      [CraftingResourcesBlueprint.IronIngot, 5],
      [CraftingResourcesBlueprint.WoodenSticks, 2],
    ]),
  ],
};
