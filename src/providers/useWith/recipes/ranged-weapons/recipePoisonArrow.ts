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
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Feather, 1],
      [CraftingResourcesBlueprint.SmallWoodenStick, 1],
      [CraftingResourcesBlueprint.ElvenLeaf, 1],
    ]),
  ],
};
