import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeRunicRadianceGloves: IUseWithCraftingRecipe = {
  outputKey: GlovesBlueprint.RunicRadianceGloves,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 90,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.MagicRecipe, 80],
      [CraftingResourcesBlueprint.ElvenLeaf, 90],
      [CraftingResourcesBlueprint.GoldenOre, 80],
      [CraftingResourcesBlueprint.Bone, 90],
    ]),
  ],
};
