import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeLightBringerSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.LightBringerSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 12,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 15],
      [CraftingResourcesBlueprint.ElvenLeaf, 12],
      [CraftingResourcesBlueprint.Leather, 5],
    ]),
  ],
};
