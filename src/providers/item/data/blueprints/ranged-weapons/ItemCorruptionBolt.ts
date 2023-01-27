import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionBolt: Partial<IItem> = {
  key: RangedWeaponsBlueprint.CorruptionBolt,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/corruption-bolt.png",
  name: "Corruption Bolt",
  description:
    "An arrow imbued with dark, otherworldly energy. It is said to be able to ignite the air around it and to be capable of piercing even the toughest materials with ease.",
  attack: 8,
  weight: 0.013,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 3,
};
