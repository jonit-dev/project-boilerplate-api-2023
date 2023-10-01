import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeStoneBreakerBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.StoneBreakerBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 90,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 34],
};
