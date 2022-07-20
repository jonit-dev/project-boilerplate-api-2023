import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenShield: Partial<IItem> = {
  key: ShieldsBlueprint.StuddedShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/wooden-shield.png",
  textureKey: "wooden-shield",
  name: "wooden-shield",
  description: "A simple round wooden shield for protection.",
  defense: 3,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
