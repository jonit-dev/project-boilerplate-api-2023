import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HammersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeMedievalCrossedHammer: IUseWithCraftingRecipe = {
  outputKey: HammersBlueprint.MedievalCrossedHammer,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 4,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 20],
      [CraftingResourcesBlueprint.WoodenBoard, 8],
      [CraftingResourcesBlueprint.Leather, 4],
    ]),
  ],
};
