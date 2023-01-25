import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenBoard: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.WoodenBoard,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/wooden-board.png",
  name: "Wooden Board",
  description: "A board made from wood. Can be used to craft a variety of items.",
  weight: 2,
  maxStackSize: 30,
  basePrice: 2,
};
