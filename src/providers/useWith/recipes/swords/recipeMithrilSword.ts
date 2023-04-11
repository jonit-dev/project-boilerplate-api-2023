import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeMithrilSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.MithrilSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 5],
      [CraftingResourcesBlueprint.RedSapphire, 4],
      [CraftingResourcesBlueprint.PhoenixFeather, 1],
    ]),
  ],
};
