import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSilvermoonArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.SilvermoonArrow,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 1],
      [CraftingResourcesBlueprint.BlueFeather, 2],
      [CraftingResourcesBlueprint.ElvenWood, 1],
    ]),
  ],
};
