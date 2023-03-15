import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.IronArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/iron-arrow.png",
  name: "Iron Arrow",
  description: "Description",
  weight: 0.06,
  maxStackSize: 100,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 3,
  attack: 12,
};
