import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemCap: Partial<IItem> = {
  key: "cap",
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/cap.png",
  textureKey: "cap",
  name: "Cap",
  description: "Simple cap.",
  defense: 2,
  weight: 0.3,
  allowedEquipSlotType: [ItemSlotType.Head],
};