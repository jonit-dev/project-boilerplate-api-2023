import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPhoenixJitte: IEquippableMeleeTier4WeaponBlueprint = {
  key: DaggersBlueprint.PhoenixJitte,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/phoenix-jitte.png",
  name: "Phoenix Jitte",
  description:
    "The Phoenix Jitte is a unique and ornate weapon, adorned with intricate gold that resemble the fiery bird from which it takes its name. The blade is made of a rare and durable metal, with a sharp edge that can deflect blows and disarm opponents.",
  weight: 0.9,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 30,
  defense: 28,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 67,
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Dexterity,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of dexterity flowing through your body. (+10% dexterity)",
          deactivation: "You feel the power of dexterity leaving your body. (-10% dexterity)",
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
  ],
  equippedBuffDescription: "Increases dexterity by 10% and dagger by 5% respectively",
};
