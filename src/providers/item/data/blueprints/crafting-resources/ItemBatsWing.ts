import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";
export const itemBatsWing: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.BatsWing,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/bats-wing.png",
  name: "Bat Wing",
  description: "A crafting resource used for witchcraft and sorcery",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 0.5,
  hasUseWith: true,
};
