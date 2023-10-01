import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipePoisonArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.PoisonArrow,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Feather, 10],
      [CraftingResourcesBlueprint.SmallWoodenStick, 5],
      [CraftingResourcesBlueprint.ElvenLeaf, 5],
    ]),
  ],
};
