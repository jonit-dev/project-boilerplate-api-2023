import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeElysianEyeStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.ElysianEyeStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 80,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 34],
};
