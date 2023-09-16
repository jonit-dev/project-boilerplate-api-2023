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
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 200,
    },
    {
      key: CraftingResourcesBlueprint.Bandage,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 80,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 100],
      [CraftingResourcesBlueprint.SteelIngot, 100],
      [CraftingResourcesBlueprint.RedSapphire, 200],
      [CraftingResourcesBlueprint.Bandage, 60],
      [CraftingResourcesBlueprint.PhoenixFeather, 80],
    ]),
  ],
};
