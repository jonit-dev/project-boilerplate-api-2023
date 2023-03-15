import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWorm: ICraftableItemBlueprint = {
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
  canSell: false,
};
