import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeElvenBolt: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.ElvenBolt,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 1,
    },
  ],
};
