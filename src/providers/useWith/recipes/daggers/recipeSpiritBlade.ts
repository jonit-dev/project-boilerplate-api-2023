import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSpiritBlade: IUseWithCraftingRecipe = {
  outputKey: DaggersBlueprint.SpiritBlade,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 80,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 80],
      [CraftingResourcesBlueprint.Bone, 80],
      [CraftingResourcesBlueprint.Herb, 100],
      [CraftingResourcesBlueprint.WoodenBoard, 80],
    ]),
  ],
};
