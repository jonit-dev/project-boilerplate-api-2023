import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSmallWorm: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.SmallWorm,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/small-worm.png",
  name: "Small Worm",
  description: "A small worm used for fishing.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 0.2,
};
