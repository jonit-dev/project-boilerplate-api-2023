import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRedSapphire: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.RedSapphire,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/red-sapphire.png",
  name: "Red Sapphire",
  description: "Red is a precious gemstone, formed from a mineral called arundu.",
  weight: 0.5,
  maxStackSize: 100,
  basePrice: 30,
};
