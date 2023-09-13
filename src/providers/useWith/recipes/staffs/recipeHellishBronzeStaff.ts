import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeHellishBronzeStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.HellishBronzeStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 6],
      [CraftingResourcesBlueprint.IronIngot, 8],
      [CraftingResourcesBlueprint.MagicRecipe, 3],
      [CraftingResourcesBlueprint.DragonTooth, 2],
    ]),
  ],
};
