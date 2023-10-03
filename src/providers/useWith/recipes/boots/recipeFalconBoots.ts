import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeFalconBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.FalconBoots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.BlueLeather,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 20,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 31],
};
