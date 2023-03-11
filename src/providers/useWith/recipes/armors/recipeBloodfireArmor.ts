import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBloodfireArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.BloodfireArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 10,
    },
  ],
};
