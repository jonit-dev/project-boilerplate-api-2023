import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPolishedStone: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.PolishedStone,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/polished-stone.png",
  name: "Polished Stone",
  description: "A crafting material made of stone polished to sharpen it.",
  weight: 0.1,
  maxStackSize: 100,
  basePrice: 3,
  hasUseWith: true,
};
