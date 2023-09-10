import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLeather: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.Leather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/leather.png",
  name: "Leather",
  description: "Raw material that can be used to craft armors and other goods",
  weight: 0.3,
  maxStackSize: 999,
  basePrice: 5,
};
