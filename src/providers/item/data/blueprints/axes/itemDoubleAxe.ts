import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemDoubleAxe: Partial<IItem> = {
  key: "double-axe",
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/double-axe.png",
  textureKey: "axe",
  name: "Double Axe",
  description: "An doubled headed axe.",
  attack: 5,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
