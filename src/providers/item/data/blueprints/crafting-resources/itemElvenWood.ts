import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemElvenWood: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.ElvenWood,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/elven-wood.png",
  name: "Elven Wood",
  description: "A piece of wood from the Elven Tree.",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 15,
  canSell: false,
};
