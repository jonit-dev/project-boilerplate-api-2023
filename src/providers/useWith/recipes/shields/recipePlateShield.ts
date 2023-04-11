import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipePlateShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.PlateShield,
  outputQtyRange: [1, 1],

  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 4],
      [CraftingResourcesBlueprint.PolishedStone, 2],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 1],
      [CraftingResourcesBlueprint.SteelIngot, 1],
    ]),
  ],
};
