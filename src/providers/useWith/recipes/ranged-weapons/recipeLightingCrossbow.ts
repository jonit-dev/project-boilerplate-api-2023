import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeLightingCrossbow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.LightningCrossbow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 10,
    },
  ],
};
