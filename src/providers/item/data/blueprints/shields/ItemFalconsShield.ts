import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFalconsShield: Partial<IItem> = {
  key: ShieldsBlueprint.FalconsShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/falcons-shield.png",
  name: "Falcon's Shield",
  description:
    "The Falcon's Shield is a noble and striking piece of defensive equipment often used by knights and other chivalrous warriors who embody the virtues of bravery, honor, and loyalty.",
  weight: 1,
  defense: 23,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
