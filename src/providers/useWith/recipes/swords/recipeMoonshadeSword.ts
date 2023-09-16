import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeMoonshadeSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.MoonshadeSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 60,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 40],
      [CraftingResourcesBlueprint.BlueSapphire, 50],
      [CraftingResourcesBlueprint.BlueSilk, 60],
    ]),
  ],
};
