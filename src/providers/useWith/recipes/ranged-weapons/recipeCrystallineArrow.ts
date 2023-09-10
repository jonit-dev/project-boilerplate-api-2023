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
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.SilverOre,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSapphire, 1],
      [CraftingResourcesBlueprint.Diamond, 1],
      [CraftingResourcesBlueprint.SilverOre, 1],
    ]),
  ],
};
