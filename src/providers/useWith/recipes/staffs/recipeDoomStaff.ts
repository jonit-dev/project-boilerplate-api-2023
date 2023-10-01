import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeDoomStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.DoomStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 160,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 160,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 40],
};
