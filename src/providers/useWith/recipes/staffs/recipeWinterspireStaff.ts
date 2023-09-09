import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeWinterspireStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.WinterspireStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 7,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 6,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 7],
      [CraftingResourcesBlueprint.BlueSapphire, 6],
      [CraftingResourcesBlueprint.MagicRecipe, 6],
    ]),
  ],
};
