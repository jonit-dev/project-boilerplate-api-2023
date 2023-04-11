import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBloodfireArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.BloodfireArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 15],
      [CraftingResourcesBlueprint.SteelIngot, 25],
      [CraftingResourcesBlueprint.GoldenIngot, 25],
      [CraftingResourcesBlueprint.RedSapphire, 10],
    ]),
  ],
};
