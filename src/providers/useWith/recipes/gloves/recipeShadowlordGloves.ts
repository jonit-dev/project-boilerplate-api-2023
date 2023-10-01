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
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 120,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 33],
};
