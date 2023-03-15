import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreenIngot: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.GreenIngot,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/green-ingot.png",
  name: "green-ingot",
  description: "A special ingot infused with magical energy, used as a material for crafting weapons.",
  weight: 1.2,
  maxStackSize: 100,
  basePrice: 24,
  canSell: false,
};
