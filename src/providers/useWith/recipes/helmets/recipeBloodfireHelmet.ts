import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBloodfireHelmet: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.BloodfireHelmet,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 7,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 7],
      [CraftingResourcesBlueprint.SteelIngot, 10],
      [CraftingResourcesBlueprint.GoldenIngot, 10],
      [CraftingResourcesBlueprint.RedSapphire, 5],
    ]),
  ],
};
