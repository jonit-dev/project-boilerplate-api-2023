import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWheat: Partial<IItem> = {
  key: CraftingResourcesBlueprint.Wheat,
  type: ItemType.CraftingResource,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/wheat.png",
  name: "Wheat",
  description: "A crafting material commonly used to make food.",
  weight: 0.25,
  maxStackSize: 100,
  basePrice: 0.5,
  hasUseWith: true,
};
