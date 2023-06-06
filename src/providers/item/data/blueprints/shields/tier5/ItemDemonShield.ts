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

export const itemDemonShield: IEquippableArmorTier5Blueprint = {
  key: ShieldsBlueprint.DemonShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/demon-shield.png",
  name: "Demon Shield",
  description: "A shield made from the scales of an ancient demon.",
  defense: 43,
  tier: 5,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 75,
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
  ],
  equippedBuffDescription: "Increases shielding by 10%, strength by 10% and resistance by 10% respectively",
};
