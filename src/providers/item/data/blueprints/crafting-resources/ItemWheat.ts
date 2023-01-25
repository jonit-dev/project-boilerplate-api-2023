import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWheat: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.Wheat,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/wheat.png",
  name: "Wheat",
  description: "A crafting material commonly used to make food.",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 0.5,
};
