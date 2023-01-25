import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLeather: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.Leather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/leather.png",
  name: "Leather",
  description: "Raw material that can be used to craft armors and other goods",
  weight: 0.7,
  maxStackSize: 20,
  basePrice: 1.5,
  hasUseWith: true,
};
