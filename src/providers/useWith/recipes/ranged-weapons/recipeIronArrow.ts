import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeIronArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.IronArrow,
  outputQtyRange: [2, 5],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Feather, 2],
      [CraftingResourcesBlueprint.SmallWoodenStick, 2],
      [CraftingResourcesBlueprint.IronIngot, 1],
    ]),
  ],
};
