import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHerb: Partial<IItem> = {
  key: CraftingResourcesBlueprint.Herb,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/herb.png",
  name: "Herb",
  description: "A crafting resource used for making healing potions and antidotes.",
  weight: 0.01,
  maxStackSize: 100,
  sellPrice: 10,
};