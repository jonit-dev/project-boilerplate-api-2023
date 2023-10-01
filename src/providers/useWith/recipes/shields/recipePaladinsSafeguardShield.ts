import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipePaladinsSafeguardShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.PaladinsSafeguardShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Bandage,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 100,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 37],
};
