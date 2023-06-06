import {
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemKnightsSword: IEquippableMeleeTier3WeaponBlueprint = {
  key: SwordsBlueprint.KnightsSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/knights-sword.png",
  name: "Knights Sword",
  description: "A well-crafted sword used by medieval knights, known for its durability and effectiveness in battle.",
  attack: 23,
  defense: 23,
  tier: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: CombatSkill.Sword,
      buffPercentage: 7,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of sword flowing through your body. (+7% sword)",
          deactivation: "You feel the power of sword leaving your body. (-7% sword)",
        },
      },
    },
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max health flowing through your body. (+5% MaxHealth)",
          deactivation: "You feel the power of max health leaving your body. (-5% MaxHealth)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases sword by 7% and max health by 5% respectively",
};
