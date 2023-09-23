import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPlasmaPierceArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.PlasmaPierceArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/plasma-pierce-arrow.png",
  name: "Plasma Pierce Arrow",
  description: "Packed with charged plasma, this arrow electrifies and burns its victims simultaneously..",
  attack: 35,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 999,
  basePrice: 27,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 85,
  canSell: false,
};
