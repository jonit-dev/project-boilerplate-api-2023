import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemElvenLeaf: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.ElvenLeaf,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/elven-leaf.png",
  name: "Elven Leaf",
  description: "A leaf from the Elven Tree.",
  weight: 0.02,
  maxStackSize: 100,
  basePrice: 8,
  hasUseWith: true,
};
