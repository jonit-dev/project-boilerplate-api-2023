import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HammersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSledgeHammer: IUseWithCraftingRecipe = {
  outputKey: HammersBlueprint.SledgeHammer,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 5],
      [CraftingResourcesBlueprint.WoodenBoard, 5],
      [CraftingResourcesBlueprint.IronNail, 2],
    ]),
  ],
};
