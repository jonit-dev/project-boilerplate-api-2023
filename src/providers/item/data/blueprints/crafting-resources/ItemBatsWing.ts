import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBatsWing: Partial<IItem> = {
  key: CraftingResourcesBlueprint.BatsWing,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/bat-wing.png",
  name: "Bat Wing",
  description: "A crafting resource used for witchcraft and sorcery",
  weight: 1,
  maxStackSize: 100,
  basePrice: 0.5,
};
