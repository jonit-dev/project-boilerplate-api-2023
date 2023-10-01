import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBloodfireBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.BloodfireBoot,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 2,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 12],
};
