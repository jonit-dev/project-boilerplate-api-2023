import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeIronBarkBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.IronBarkBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 12,
    },
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreaterWoodenLog, 12],
      [CraftingResourcesBlueprint.IronNail, 8],
      [CraftingResourcesBlueprint.ElvenWood, 10],
    ]),
  ],
};
