import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPhoenixFeather: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.PhoenixFeather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/phoenix-feather.png",
  name: "Phoenix Feather",
  description: "Feather from a phoenix. Can be used to craft a variety of items.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 20,
  hasUseWith: true,
};
