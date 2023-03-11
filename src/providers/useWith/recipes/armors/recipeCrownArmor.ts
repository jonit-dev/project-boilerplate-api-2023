import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCrownArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.CrownArmor,
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
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 20,
    },
  ],
};
