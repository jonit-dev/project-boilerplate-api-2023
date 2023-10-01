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
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 8,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 10],
};
