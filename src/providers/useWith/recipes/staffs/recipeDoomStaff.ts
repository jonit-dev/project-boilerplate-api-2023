import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeDoomStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.DoomStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 8,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumOre, 15],
      [CraftingResourcesBlueprint.DragonHead, 3],
      [CraftingResourcesBlueprint.DragonTooth, 4],
      [CraftingResourcesBlueprint.MagicRecipe, 8],
    ]),
  ],
};
