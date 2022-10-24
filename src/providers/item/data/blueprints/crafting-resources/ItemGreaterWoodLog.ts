import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreaterWoodLog: Partial<IItem> = {
  key: CraftingResourcesBlueprint.GreaterWoodLog,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/greater-wood-log.png",
  name: "Greater Wood Log",
  description: "A heavy crafting resource that is generally split into smaller logs before usage.",
  weight: 10,
  maxStackSize: 10,
};
