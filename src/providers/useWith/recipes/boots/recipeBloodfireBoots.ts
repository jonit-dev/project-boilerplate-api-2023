import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBloodfireBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.BloodfireBoot,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 5],
      [CraftingResourcesBlueprint.DragonTooth, 5],
      [CraftingResourcesBlueprint.RedSapphire, 5],
    ]),
  ],
};
