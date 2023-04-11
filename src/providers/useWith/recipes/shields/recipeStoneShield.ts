import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeStoneShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.HolyShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 10],
      [CraftingResourcesBlueprint.IronIngot, 10],
      [CraftingResourcesBlueprint.PolishedStone, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 5],
    ]),
  ],
};
