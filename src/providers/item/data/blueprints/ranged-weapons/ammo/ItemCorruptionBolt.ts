import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemCorruptionBolt: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.CorruptionBolt,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/corruption-bolt.png",
  name: "Corruption Bolt",
  description:
    "An arrow imbued with dark, otherworldly energy. It is said to be able to ignite the air around it and to be capable of piercing even the toughest materials with ease.",
  attack: 18,
  weight: 0.013,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 3,
  canSell: false,
};