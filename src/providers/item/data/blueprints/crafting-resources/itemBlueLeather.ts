import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueLeather: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.BlueLeather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/blue-leather.png",
  name: "Blue Leather",
  description: "A craft blue leather. Made from a Snow Wolf.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 1.5,
  hasUseWith: true,
};
