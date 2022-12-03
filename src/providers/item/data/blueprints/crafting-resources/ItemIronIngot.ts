import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronIngot: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.IronIngot,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/iron-ingot.png",
  name: "Iron Ingot",
  description: "An useful and common crafting resource.",
  weight: 1,
  maxStackSize: 10,
  basePrice: 0.5,
  hasUseWith: true,
};
