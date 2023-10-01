import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeLunarWand: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.LunarWand,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 130,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 37],
};
