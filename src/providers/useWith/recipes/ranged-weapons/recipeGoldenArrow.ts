import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGoldenArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.GoldenArrow,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Feather, 1],
      [CraftingResourcesBlueprint.SmallWoodenStick, 1],
      [CraftingResourcesBlueprint.GoldenIngot, 1],
    ]),
  ],
};
