import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";
export const itemDiamond: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.Diamond,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/diamond.png",
  name: "Diamond",
  description: "A rare item that can be used as a jewel or as a crafting resource.",
  weight: 0.25,
  maxStackSize: 999,
  basePrice: 30,
};
