import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSkull: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.Skull,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/skull.png",
  name: "Skull",
  description: "A skull that can be used for crafting weapons or tools.",
  weight: 0.28,
  maxStackSize: 100,
  basePrice: 9,
};
