import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemObsidiumIngot: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.ObsidiumIngot,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/obsidium-ingot.png",
  name: "obsidium-ingot",
  description: "A rare and powerful ingot imbued with magical properties, used as a material for forging weapons.",
  weight: 1,
  maxStackSize: 999,
  basePrice: 28,
  canSell: false,
};
