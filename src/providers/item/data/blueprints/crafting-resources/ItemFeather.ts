import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFeather: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.Feather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/feather.png",
  name: "Feather",
  description: "A common crafting resource, used mainly for making projectiles",
  weight: 0.01,
  maxStackSize: 999,
  basePrice: 2,
};
