import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeStoneBreakerBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.StoneBreakerBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 9,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 8,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 9],
      [CraftingResourcesBlueprint.PolishedStone, 4],
      [CraftingResourcesBlueprint.Leather, 8],
    ]),
  ],
};
