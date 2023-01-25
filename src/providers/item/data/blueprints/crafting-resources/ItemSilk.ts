import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSilk: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.Silk,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/silk.png",
  name: "Silk",
  description: "A crafting resource used for making clothes and other items",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 0.5,
  hasUseWith: true,
};
