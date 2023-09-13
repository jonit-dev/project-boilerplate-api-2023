import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSpiritBlade: IUseWithCraftingRecipe = {
  outputKey: DaggersBlueprint.SpiritBlade,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 20],
      [CraftingResourcesBlueprint.Bone, 8],
      [CraftingResourcesBlueprint.Herb, 10],
    ]),
  ],
};
