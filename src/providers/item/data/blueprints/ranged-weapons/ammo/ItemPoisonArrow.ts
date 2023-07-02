import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPoisonArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.PoisonArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/poison-arrow.png",
  name: "Poison Arrow",
  description: "An arrow coated with poison.",
  attack: 18,
  weight: 0.025,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 999,
  basePrice: 1.5,
  entityEffects: [EntityEffectBlueprint.Poison],
  entityEffectChance: 90,
  canSell: false,
};
