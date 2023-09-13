import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeDragonWingBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.DragonWingBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 1],
      [CraftingResourcesBlueprint.DragonTooth, 1],
      [CraftingResourcesBlueprint.Leather, 1],
    ]),
  ],
};
