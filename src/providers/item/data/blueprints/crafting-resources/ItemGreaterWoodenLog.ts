import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreaterWoodenLog: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.GreaterWoodenLog,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/greater-wooden-log.png",
  name: "Greater Wooden Log",
  description: "A heavy crafting resource that is generally split into smaller logs before usage.",
  weight: 1.5,
  maxStackSize: 999,
  basePrice: 7,
  canSell: false,
};
