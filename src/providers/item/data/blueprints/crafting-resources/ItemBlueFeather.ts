import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueFeather: Partial<IItem> = {
  key: CraftingResourcesBlueprint.BlueFeather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/blue-feather.png",
  name: "Blue Feather",
  description: "A craft material used to make arrows.",
  weight: 0.1,
  maxStackSize: 100,
  basePrice: 0.5,
  hasUseWith: true,
};
