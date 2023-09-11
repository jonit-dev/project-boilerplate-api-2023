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
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 80,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumOre, 150],
      [CraftingResourcesBlueprint.DragonHead, 5],
      [CraftingResourcesBlueprint.DragonTooth, 10],
      [CraftingResourcesBlueprint.MagicRecipe, 80],
    ]),
  ],
};
