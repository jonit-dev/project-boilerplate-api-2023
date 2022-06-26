import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBasiliskSword: Partial<IItem> = {
  key: "basilisk-sword",
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/basilisk-sword.png",
  textureKey: "basilisk-sword",
  name: "Basilisk Sword",
  description:
    "You see a basilisk sword. It's used by a reptile reputed to be a serpent king, who can cause death with a single glance.",
  attack: 10,
  defense: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
