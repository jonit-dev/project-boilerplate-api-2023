import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBardiche: Partial<IItem> = {
  key: "bardiche",
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/bardiche.png",
  textureKey: "axe",
  name: "Bardiche",
  description: "A polearm with a large blade at one end.",
  attack: 5,
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
