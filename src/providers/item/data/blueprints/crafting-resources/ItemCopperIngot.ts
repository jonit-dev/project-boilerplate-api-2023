import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCopperIngot: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.CopperIngot,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/copper-ingot.png",
  name: "Copper Ingot",
  description:
    "A copper ingot. You can use this material with a hammer to craft weapons, but you need to be close to an anvil.",
  weight: 1,
  maxStackSize: 999,
  basePrice: 25,
  canSell: false,
};
