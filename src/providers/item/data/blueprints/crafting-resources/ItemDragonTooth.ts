import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDragonTooth: Partial<IItem> = {
  key: CraftingResourcesBlueprint.DragonTooth,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/dragon-tooth.png",
  name: "Dragon Tooth",
  description: "A dragon tooth  used to craft magic items.",
  weight: 1,
};
