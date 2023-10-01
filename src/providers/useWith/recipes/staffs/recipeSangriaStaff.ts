import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSangriaStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.SangriaStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 60,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 31],
};
