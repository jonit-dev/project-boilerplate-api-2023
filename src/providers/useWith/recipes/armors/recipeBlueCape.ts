import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBlueCape: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.BlueCape,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSilk, 10],
      [CraftingResourcesBlueprint.RedSapphire, 10],
      [CraftingResourcesBlueprint.BlueSapphire, 10],
    ]),
  ],
};
