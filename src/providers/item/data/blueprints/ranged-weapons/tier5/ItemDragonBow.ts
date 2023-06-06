import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableRangedTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDragonBow: IEquippableRangedTier5WeaponBlueprint = {
  key: RangedWeaponsBlueprint.DragonBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/dragon-bow.png",
  name: "Dragon Bow",
  description: "A powerful bow made from dragon bones.",
  attack: 43,
  tier: 5,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.PoisonArrow,
    RangedWeaponsBlueprint.ShockArrow,
    RangedWeaponsBlueprint.GoldenArrow,
    RangedWeaponsBlueprint.EmeraldArrow,
    RangedWeaponsBlueprint.CrimsonArrow,
  ],
  isTwoHanded: true,
  basePrice: 90,
  equippedBuff: [
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max health flowing through your body. (+10% MaxHealth)",
          deactivation: "You feel the power of max health leaving your body. (-10% MaxHealth)",
        },
      },
    },
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxMana,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max mana flowing through your body. (+10% MaxMana)",
          deactivation: "You feel the power of max mana leaving your body. (-10% MaxMana)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: CombatSkill.Distance,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of distance flowing through your body. (+10% distance)",
          deactivation: "You feel the power of distance leaving your body. (-10% distance)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Strength,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of strength flowing through your body. (+10% strength)",
          deactivation: "You feel the power of strength leaving your body. (-10% strength)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of resistance flowing through your body. (+10% resistance)",
          deactivation: "You feel the power of resistance leaving your body. (-10% resistance)",
        },
      },
    },
  ],
  equippedBuffDescription:
    "Increases max health by 10% ,max mana by 10%, distance by 10%, strength by 10% and resistance by 10% respectively",
};
