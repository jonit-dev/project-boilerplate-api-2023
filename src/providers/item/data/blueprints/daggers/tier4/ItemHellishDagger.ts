import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHellishDagger: IEquippableMeleeTier4WeaponBlueprint = {
  key: DaggersBlueprint.HellishDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/hellish-dagger.png",
  name: "Hellish Dagger",
  description:
    "A small knife imbued with dark, otherworldly energy. It is said to be able to ignite the air around it and to be capable of cutting through even the toughest materials with ease.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 32,
  defense: 30,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 57,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 80,
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of resistance flowing through your body. (+5% resistance)",
          deactivation: "You feel the power of resistance leaving your body. (-5% resistance)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: CombatSkill.Dagger,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of dagger flowing through your body. (+5% dagger)",
          deactivation: "You feel the power of dagger leaving your body. (-5% dagger)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Dexterity,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of dexterity flowing through your body. (+5% dexterity)",
          deactivation: "You feel the power of dexterity leaving your body. (-5% dexterity)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases resistance by 5%, dagger by 5% and dexterity by 5% respectively",
};
