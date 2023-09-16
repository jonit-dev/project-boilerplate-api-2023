import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeStoneBreakerBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.StoneBreakerBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 80,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 90],
      [CraftingResourcesBlueprint.PolishedStone, 40],
      [CraftingResourcesBlueprint.WoodenBoard, 80],
      [CraftingResourcesBlueprint.PhoenixFeather, 80],
    ]),
  ],
};
