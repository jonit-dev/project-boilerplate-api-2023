import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueLeather: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.BlueLeather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/blue-leather.png",
  name: "Blue Leather",
  description: "A craft material used for special armors.",
  weight: 0.01,
  maxStackSize: 999,
  basePrice: 12,
};
