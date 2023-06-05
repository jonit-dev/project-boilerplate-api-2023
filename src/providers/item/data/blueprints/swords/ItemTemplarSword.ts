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
} from "@rpg-engine/shared";
import { IEquippableMeleeTier5WeaponBlueprint } from "../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemTemplarSword: IEquippableMeleeTier5WeaponBlueprint = {
  key: SwordsBlueprint.TemplarSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/templar-sword.png",
  name: "templar-sword",
  description:
    "The blade of a Templar sword is typically made of high-quality steel and features a straight, double-edged shape that is ideal for thrusting and cutting",
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 43,
  defense: 12,
  rangeType: EntityAttackType.Melee,
  isTwoHanded: true,
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
      trait: CombatSkill.Sword,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of sword flowing through your body. (+10% sword)",
          deactivation: "You feel the power of sword leaving your body. (-10% sword)",
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
  ],
  equippedBuffDescription:
    "Increases max health by 10% ,max mana by 10%, sword by 10%, strength by 10% and distance by 10% respectively",
  tier: 5,
};
