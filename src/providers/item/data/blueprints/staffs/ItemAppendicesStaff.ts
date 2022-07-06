import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemAppendicesStaff: Partial<IItem> = {
  key: "appendice's-staff",
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "staffs/appendice's-staff.png",
  textureKey: "appendice's-staff",
  name: "Appendice's Staff",
  description: "A simple wooden staff used by those learning the basics of magic.",
  attack: 1,
  defense: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
