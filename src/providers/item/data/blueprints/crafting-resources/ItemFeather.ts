import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFeather: Partial<IItem> = {
  key: CraftingResourcesBlueprint.Feather,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/feather.png",
  name: "Feather",
  description: "A common crafting resource, used mainly for making projectiles",
  weight: 0.01,
  maxStackSize: 100,
};
