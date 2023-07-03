import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCorruptionSword: IEquippableMeleeTier3WeaponBlueprint = {
  key: SwordsBlueprint.CorruptionSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/corruption-sword.png",
  name: "Corruption Sword",
  description:
    "A sinister sword imbued with corrupting energies, capable of sapping the strength and vitality of its victims.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 24,
  defense: 23,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
  entityEffects: [EntityEffectBlueprint.Corruption],
  entityEffectChance: 70,
};
