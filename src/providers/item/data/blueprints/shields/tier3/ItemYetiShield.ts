import {
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemYetiShield: IEquippableArmorTier3Blueprint = {
  key: ShieldsBlueprint.YetiShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/yeti-shield.png",
  name: "Yeti's Shield",
  description: "A rare shield used by Yetis, against the frost island invaders.",
  defense: 29,
  tier: 3,
  weight: 1.8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 57,
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
  ],
  equippedBuffDescription: "Increases shielding by 10% and max health by 10% respectively",
};
