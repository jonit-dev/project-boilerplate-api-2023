import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueSapphire: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.BlueSapphire,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/blue-sapphire.png",
  name: "Blue Sapphire",
  description: "Sapphire is a precious gemstone, formed from a mineral called corundum.",
  weight: 0.5,
  maxStackSize: 35,
  basePrice: 5,
  hasUseWith: true,
};
