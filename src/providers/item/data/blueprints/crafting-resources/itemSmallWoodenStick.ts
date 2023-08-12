import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSmallWoodenStick: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.SmallWoodenStick,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/small-wood-sticks.png",
  name: "Small Wooden Sticks",
  description: "Small Wooden sticks used for crafting.",
  weight: 1,
  maxStackSize: 999,
  basePrice: 2,
  canSell: false,
};
