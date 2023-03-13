import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBloodstainedCenser: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.BloodstainedCenser,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 3,
    },
  ],
};
