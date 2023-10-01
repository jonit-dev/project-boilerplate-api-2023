import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSilverBulbMace: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.SilverBulbMace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 4],
      [CraftingResourcesBlueprint.Diamond, 1],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 2],
    ]),
  ],
};
