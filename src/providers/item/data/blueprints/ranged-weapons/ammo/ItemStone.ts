import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStone: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.Stone,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/stone.png",
  name: "Stone",
  description: "A stone.",
  attack: 8,
  weight: 0.15,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 1,
  canSell: false,
};
