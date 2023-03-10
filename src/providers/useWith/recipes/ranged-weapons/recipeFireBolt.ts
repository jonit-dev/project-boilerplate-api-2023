import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeFireBolt: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.FireBolt,
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
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 1,
    },
  ],
};
