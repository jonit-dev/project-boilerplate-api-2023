import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBloodseekerBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.BloodseekerBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Bones,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 80,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 36],
};
