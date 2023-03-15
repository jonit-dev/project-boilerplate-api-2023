import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenIngot: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.GoldenIngot,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/golden-ingot.png",
  name: "Golden Ingot",
  description:
    "A golden ingot. You can use this material with a hammer to craft weapons, but you need to be close to an anvil.",
  weight: 1,
  maxStackSize: 100,
  basePrice: 25,
  canSell: false,
};
