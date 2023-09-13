import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDragonHead: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.DragonHead,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/dragon-head.png",
  name: "Dragon Head",
  description: "A dragon head skull used to craft magic items.",
  weight: 1,
  maxStackSize: 999,
  basePrice: 1000,
};
