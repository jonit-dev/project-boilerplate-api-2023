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
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 30,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 100],
      [CraftingResourcesBlueprint.WoodenBoard, 80],
      [CraftingResourcesBlueprint.ElvenWood, 50],
      [CraftingResourcesBlueprint.SteelIngot, 30],
    ]),
  ],
};
