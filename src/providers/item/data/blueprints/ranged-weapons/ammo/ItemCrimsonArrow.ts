import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCrimsonArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.CrimsonArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/crimson-arrow.png",
  name: "Crimson Arrow",
  description: "A specialized arrow with a crimson hue.",
  attack: 30,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 50,
  basePrice: 12,
};
