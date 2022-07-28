import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HammersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWarHammer: Partial<IItem> = {
  key: HammersBlueprint.WarHammer,
  type: ItemType.Tool,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "hammers/war-hammer.png",
  textureKey: "war-hammer",
  name: "War Hammer",
  description: "A large war hammer.",
  attack: 5,
  defense: 0,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};