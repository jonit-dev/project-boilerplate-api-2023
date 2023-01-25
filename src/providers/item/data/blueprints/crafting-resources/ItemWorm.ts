import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWorm: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.Worm,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/worm.png",
  name: "Worm",
  description: "A worm used for fishing.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 0.5,
};
