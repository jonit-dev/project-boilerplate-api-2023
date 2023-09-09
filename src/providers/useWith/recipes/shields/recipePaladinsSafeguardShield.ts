import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipePaladinsSafeguardShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.PaladinsSafeguardShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 16,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Bandage,
      qty: 6,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 16],
      [CraftingResourcesBlueprint.RedSapphire, 2],
      [CraftingResourcesBlueprint.Bandage, 6],
    ]),
  ],
};
