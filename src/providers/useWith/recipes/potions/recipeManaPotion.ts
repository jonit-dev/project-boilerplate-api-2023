import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeManaPotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.ManaPotion,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 4,
    },
  ],
};
