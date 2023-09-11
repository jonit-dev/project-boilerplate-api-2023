import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeStarsHooterBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.StarsHooterBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 40,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 90],
      [CraftingResourcesBlueprint.Diamond, 80],
      [CraftingResourcesBlueprint.WoodenBoard, 40],
    ]),
  ],
};
