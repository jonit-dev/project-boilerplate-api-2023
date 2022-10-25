import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDiamond: Partial<IItem> = {
  key: CraftingResourcesBlueprint.Diamond,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/diamond.png",
  name: "Diamond",
  description: "A rare item that can be used as a jewel or as a crafting resource.",
  weight: 0.25,
  maxStackSize: 10,
};
