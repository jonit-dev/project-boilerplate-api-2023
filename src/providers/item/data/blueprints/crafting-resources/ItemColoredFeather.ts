import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemColoredFeather: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.ColoredFeather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/colored-feather.png",
  name: "Colored feather",
  description: "A crafting resource used for making arrows and magic items",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 30,
};
