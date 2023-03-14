import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDragonHead: Partial<IItem> = {
  key: CraftingResourcesBlueprint.DragonHead,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/dragon-head.png",
  name: "Dragon Head",
  description: "A dragon head skull used to craft magic items.",
  weight: 1,
  maxStackSize: 100,
};
