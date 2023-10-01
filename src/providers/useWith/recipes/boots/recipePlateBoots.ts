import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipePlateBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.PlateBoots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 8,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 8],
      [CraftingResourcesBlueprint.PolishedStone, 8],
    ]),
  ],
};
