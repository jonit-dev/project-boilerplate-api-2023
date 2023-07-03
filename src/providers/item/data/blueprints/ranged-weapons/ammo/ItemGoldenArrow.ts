import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGoldenArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.GoldenArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/golden-arrow.png",
  name: "Golden Arrow",
  description: "An arrow made of pure gold that deals extra damage to enemies weak to gold.",
  attack: 28,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 999,
  basePrice: 3,
  canSell: false,
};
