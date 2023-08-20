import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenSticks: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.WoodenSticks,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/wooden-sticks.png",
  name: "Wooden Sticks",
  description: "Wooden sticks used for crafting.",
  weight: 0.4,
  maxStackSize: 999,
  basePrice: 1,
  canSell: false,
};
