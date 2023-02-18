import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenShield: Partial<IItem> = {
  key: ShieldsBlueprint.WoodenShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/wooden-shield.png",
  name: "Wooden Shield",
  description: "A simple round wooden shield for protection.",
  defense: 1,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 37,
};
