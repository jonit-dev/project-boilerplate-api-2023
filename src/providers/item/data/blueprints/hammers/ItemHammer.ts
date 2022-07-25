import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HammersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHammer: Partial<IItem> = {
  key: HammersBlueprint.Hammer,
  type: ItemType.Tool,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "hammers/hammer.png",
  textureKey: "hammer",
  name: "Hammer",
  description: "A simple hammer.",
  attack: 2,
  defense: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
