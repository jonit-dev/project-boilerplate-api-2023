import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBow: Partial<IItem> = {
  key: "bow",
  type: ItemType.Weapon,
  subType: ItemSubType.Bow,
  textureAtlas: "items",
  texturePath: "bows/bow.png",
  textureKey: "Bow",
  name: "Bow",
  description:
    "A weapon used for shooting arrows and usually made of a strip of wood bent by a cord connecting the two end.",
  attack: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};