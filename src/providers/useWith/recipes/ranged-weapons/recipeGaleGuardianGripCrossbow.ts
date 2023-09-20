import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGaleGuardianGripCrossbow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.GaleGuardianGripCrossbow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 30,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 40],
      [CraftingResourcesBlueprint.BlueFeather, 80],
      [CraftingResourcesBlueprint.WoodenBoard, 90],
      [CraftingResourcesBlueprint.ObsidiumOre, 30],
    ]),
  ],
};
