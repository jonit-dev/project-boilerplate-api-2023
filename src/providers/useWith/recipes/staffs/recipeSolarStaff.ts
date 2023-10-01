import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSolarStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.SolarStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 80,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 35],
};
