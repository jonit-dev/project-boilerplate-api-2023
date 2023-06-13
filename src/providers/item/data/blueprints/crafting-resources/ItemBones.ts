import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBones: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.Bones,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/bones.png",
  name: "Bones",
  description: "Bones that can be used for crafting weapons or tools.",
  weight: 0.29,
  maxStackSize: 100,
  basePrice: 5,
};
