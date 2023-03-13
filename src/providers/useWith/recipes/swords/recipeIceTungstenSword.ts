import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTungstenSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.TungstenSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 1,
    },
  ],
};
