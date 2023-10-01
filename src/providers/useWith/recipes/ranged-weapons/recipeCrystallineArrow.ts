import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCrystallineArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.CrystallineArrow,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSapphire, 4],
      [CraftingResourcesBlueprint.Diamond, 3],
      [CraftingResourcesBlueprint.SilverIngot, 10],
    ]),
  ],
};
