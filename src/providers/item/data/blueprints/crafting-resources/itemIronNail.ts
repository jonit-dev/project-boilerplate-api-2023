import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronNail: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.IronNail,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/iron-nail.png",
  name: "Iron nail",
  description: "An useful and common crafting resource.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 0.1,
  hasUseWith: true,
};
