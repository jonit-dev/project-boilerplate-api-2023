import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableArmorTier5Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCrimsonAegisShield: IEquippableArmorTier5Blueprint = {
  key: ShieldsBlueprint.CrimsonAegisShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/crimson-aegis-shield.png",
  name: "Crimson Aegis Shield",
  description:
    "The Crimson Aegis Shield is a powerful and imposing piece of defensive equipment often used by elite warriors and knights who serve as protectors of the realm",
  weight: 1,
  defense: 40,
  tier: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: CombatSkill.Shielding,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of shielding flowing through your body. (+10% shielding)",
          deactivation: "You feel the power of shielding leaving your body. (-10% shielding)",
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
          activation: "You feel the power of magic resistance flowing through your body. (+10% magic resistance)",
          deactivation: "You feel the power of magic resistance leaving your body. (-10% magic resistance)",
        },
      },
    },
  ],
  equippedBuffDescription:
    "Increases shielding by 10%, strength by 10%, resistance by 10%, magic by 10% and magic resistance by 10% respectively",
};
