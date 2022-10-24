import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemObsidian: Partial<IItem> = {
  key: CraftingResourcesBlueprint.Obsidian,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/obsidian.png",
  name: "Obsidian",
  description: "A crafting material made of naturally occurring volcanic glass.",
  weight: 1,
  maxStackSize: 100,
};
