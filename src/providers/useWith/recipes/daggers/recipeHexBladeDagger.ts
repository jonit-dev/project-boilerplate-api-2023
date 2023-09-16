import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeHexBladeDagger: IUseWithCraftingRecipe = {
  outputKey: DaggersBlueprint.HexBladeDagger,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 40],
      [CraftingResourcesBlueprint.Skull, 80],
      [CraftingResourcesBlueprint.SteelIngot, 50],
    ]),
  ],
};
