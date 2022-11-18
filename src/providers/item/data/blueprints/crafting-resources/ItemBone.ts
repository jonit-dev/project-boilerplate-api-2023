import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBone: Partial<IItem> = {
  key: CraftingResourcesBlueprint.Bone,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/bone.png",
  name: "Bone",
  description: "A bone that can be used for crafting weapons or tools.",
  weight: 0.25,
  maxStackSize: 10,
  basePrice: 5,
  hasUseWith: true,
};
