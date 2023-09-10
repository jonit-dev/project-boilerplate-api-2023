import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSilvermoonArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.SilvermoonArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/silvermoon-arrow.png",
  name: "Silvermoon Arrow",
  description: "Soaked in lunar energy, these arrows can change shape according to the moon phase. Highly versatile.",
  weight: 0.2,
  maxStackSize: 999,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 10,
  attack: 23,
  canSell: false,
};
