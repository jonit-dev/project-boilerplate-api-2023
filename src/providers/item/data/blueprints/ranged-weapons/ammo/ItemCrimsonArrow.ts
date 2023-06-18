import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
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
  attack: 24,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 12,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 80,
  canSell: false,
};
