import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronIngot: Partial<IItem> = {
  key: CraftingResourcesBlueprint.IronIngot,
  type: ItemType.CraftingResource,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/iron-ingot.png",
  name: "Iron Ingot",
  description: "An useful and common crafting resource.",
  weight: 1,
  maxStackSize: 100,
  basePrice: 0.5,
  hasUseWith: true,
};
