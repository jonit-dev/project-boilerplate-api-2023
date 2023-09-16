import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeIronBarkBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.IronBarkBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 30,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.WoodenBoard, 30],
      [CraftingResourcesBlueprint.IronNail, 80],
      [CraftingResourcesBlueprint.ElvenWood, 10],
      [CraftingResourcesBlueprint.CorruptionIngot, 30],
    ]),
  ],
};
