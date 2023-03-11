import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBrassArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.BrassArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 25,
    },
  ],
};
