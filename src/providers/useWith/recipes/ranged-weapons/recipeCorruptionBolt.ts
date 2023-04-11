import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCorruptionBolt: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.CorruptionBolt,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SmallWoodenStick, 1],
      [CraftingResourcesBlueprint.CorruptionIngot, 1],
    ]),
  ],
};
