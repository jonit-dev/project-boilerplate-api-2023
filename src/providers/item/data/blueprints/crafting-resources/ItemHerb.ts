import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHerb: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.Herb,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/herb.png",
  name: "Herb",
  description: "A crafting resource used for making healing potions and antidotes.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 0.5,
  hasUseWith: true,
};
