import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDarkShield: Partial<IItem> = {
  key: ShieldsBlueprint.DarkShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/dark-shield.png",
  name: "Dark Shield",
  description: "A shield imbued with dark magic of shadowlands.",
  defense: 20,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 65,
};
