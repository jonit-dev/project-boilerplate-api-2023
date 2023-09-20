import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeShadowlordGloves: IUseWithCraftingRecipe = {
  outputKey: GlovesBlueprint.ShadowlordGloves,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.CopperOre,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 150,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 120],
      [CraftingResourcesBlueprint.CopperOre, 130],
      [CraftingResourcesBlueprint.Eye, 140],
      [CraftingResourcesBlueprint.BatsWing, 150],
    ]),
  ],
};
