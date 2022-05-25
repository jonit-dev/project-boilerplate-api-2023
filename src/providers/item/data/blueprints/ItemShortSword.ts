import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemShortSword: Partial<IItem> = {
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureKey: "short-sword",
  name: "Short Sword",
  description: "You see a short sword. It is a single-handed sword with a handle that just features a grip.",
  attack: 5,
  defense: 0,
  weight: 10,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
