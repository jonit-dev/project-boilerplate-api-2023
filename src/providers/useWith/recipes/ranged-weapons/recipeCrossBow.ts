import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCrossBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.Crossbow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 5],
};
