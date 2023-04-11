import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWaterBottle: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.WaterBottle,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/water-bottle.png",
  name: "Water",
  description: "A bottle of water",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 3,
};
