import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipePlateArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.PlateArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 10,
    },
  ],
  successChance: 20,
};
