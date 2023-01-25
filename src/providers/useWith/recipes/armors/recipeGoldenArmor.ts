import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeGoldenArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.GoldenArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 10,
    },
  ],
  successChance: 10,
};
