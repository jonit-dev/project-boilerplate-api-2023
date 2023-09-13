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
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.Bandage,
      qty: 9,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 4],
      [CraftingResourcesBlueprint.Skull, 8],
      [CraftingResourcesBlueprint.Bandage, 9],
    ]),
  ],
};
