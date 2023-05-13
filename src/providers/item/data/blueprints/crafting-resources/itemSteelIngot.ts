import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSteelIngot: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.SteelIngot,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/steel-ingot.png",
  name: "Steel Ingot",
  description: "An useful and common Steel Ingot for crafting.",
  weight: 1,
  maxStackSize: 10,
  basePrice: 50,
  canSell: false,
};
