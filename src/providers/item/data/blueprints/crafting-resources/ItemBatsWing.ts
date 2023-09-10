import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBatsWing: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.BatsWing,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/bats-wing.png",
  name: "Bat Wing",
  description: "A crafting resource used for witchcraft and sorcery",
  weight: 0.01,
  maxStackSize: 999,
  basePrice: 2,
};
