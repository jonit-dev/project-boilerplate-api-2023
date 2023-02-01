import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemElvenWood: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.ElvenWood,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/elven-wood.png",
  name: "Elven Wood",
  description: "A piece of wood from the Elven Tree.",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 5,
  hasUseWith: true,
};
