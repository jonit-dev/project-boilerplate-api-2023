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
      qty: 9,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 4,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 9],
      [CraftingResourcesBlueprint.Diamond, 10],
      [CraftingResourcesBlueprint.Leather, 4],
    ]),
  ],
};
