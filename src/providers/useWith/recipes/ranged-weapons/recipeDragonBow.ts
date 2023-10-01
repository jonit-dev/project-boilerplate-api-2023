import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeDragonBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.DragonBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 1,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 17],
};
