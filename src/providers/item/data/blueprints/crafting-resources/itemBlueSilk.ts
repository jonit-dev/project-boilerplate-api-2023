import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueSilk: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.BlueSilk,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/blue-silk.png",
  name: "Blue Silk",
  description: "A crafting resource used for making clothes and other items",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 0.5,
  hasUseWith: true,
};
