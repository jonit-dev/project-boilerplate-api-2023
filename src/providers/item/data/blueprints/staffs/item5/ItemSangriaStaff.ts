import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableTwoHandedStaffTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSangriaStaff: IEquippableTwoHandedStaffTier5WeaponBlueprint = {
  key: StaffsBlueprint.SangriaStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Red,
  textureAtlas: "items",
  texturePath: "staffs/sangria-staff.png",
  name: "Sangria Staff",
  description:
    "The Sangria staff is a powerful weapon imbued with the essence of blood magic. The staff is made of a purple dark, polished wood with intricate carvings and a single red gemstone set at the top. The gemstone is not just for decoration, but is in fact a potent magic crystal that enhances the wielder's blood magic abilities.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 38,
  defense: 10,
  tier: 5,
  maxRange: RangeTypes.Medium,
  basePrice: 93,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Bleeding],
  entityEffectChance: 80,
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
      trait: BasicAttribute.Magic,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of magic flowing through your body. (+10% magic)",
          deactivation: "You feel the power of magic leaving your body. (-10% magic)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.MagicResistance,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of magic resistance flowing through your body. (+10% MagicResistance)",
          deactivation: "You feel the power of magic resistance leaving your body. (-10% MagicResistance)",
        },
      },
    },
  ],
  equippedBuffDescription:
    "Increases max health by 10%, max mana by 10%, magic by 10% and magic resistance by 10% respectively",
};
