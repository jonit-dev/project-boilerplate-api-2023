import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronIngot: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.IronIngot,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/iron-ingot.png",
  name: "Iron Ingot",
  description:
    "An iron ingot. You can use this material with a hammer to craft weapons, but you need to be close to an anvil.",
  weight: 1,
  maxStackSize: 100,
  basePrice: 12,
  canSell: false,
};
