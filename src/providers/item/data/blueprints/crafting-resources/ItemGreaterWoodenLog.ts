import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreaterWoodenLog: Partial<IItem> = {
  key: CraftingResourcesBlueprint.GreaterWoodenLog,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/greater-wooden-log.png",
  name: "Greater Wooden Log",
  description: "A heavy crafting resource that is generally split into smaller logs before usage.",
  weight: 10,
  maxStackSize: 10,
  basePrice: 5,
};
