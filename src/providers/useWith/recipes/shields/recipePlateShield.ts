import { ShieldsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipePlateShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.PlateShield,
  outputQtyRange: [1, 1],

  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 2,
    },
  ],
  successChance: 35,
};
