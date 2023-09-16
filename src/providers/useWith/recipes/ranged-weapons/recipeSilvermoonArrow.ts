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
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 10],
      [CraftingResourcesBlueprint.BlueFeather, 20],
      [CraftingResourcesBlueprint.ElvenWood, 10],
    ]),
  ],
};
