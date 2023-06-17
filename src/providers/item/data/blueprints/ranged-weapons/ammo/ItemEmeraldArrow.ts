import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEmeraldArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.EmeraldArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/emerald-arrow.png",
  name: "Emerald Arrow",
  description: "An arrow adorned with a gleaming emerald gem.",
  attack: 23,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 8,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 80,
  canSell: false,
};
