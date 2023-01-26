import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipePlateBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.PlateBoots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 10,
    },
  ],
};
