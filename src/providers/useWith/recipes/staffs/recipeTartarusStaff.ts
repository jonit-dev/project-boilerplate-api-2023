import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTartarusStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.TartarusStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: MagicsBlueprint.CorruptionRune,
      qty: 10,
    },
    {
      key: MagicsBlueprint.DarkRune,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSapphire, 10],
      [CraftingResourcesBlueprint.BlueFeather, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 3],
      [CraftingResourcesBlueprint.BlueSilk, 3],
    ]),
  ],
};
