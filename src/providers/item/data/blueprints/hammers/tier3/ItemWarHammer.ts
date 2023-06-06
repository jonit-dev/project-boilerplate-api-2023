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
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { HammersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWarHammer: IEquippableMeleeTier3WeaponBlueprint = {
  key: HammersBlueprint.WarHammer,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "hammers/war-hammer.png",
  name: "War Hammer",
  description: "A large war hammer.",
  attack: 25,
  defense: 13,
  tier: 3,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Strength,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of strength flowing through your body. (+5% strength)",
          deactivation: "You feel the power of strength leaving your body. (-5% strength)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: CombatSkill.Club,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of club flowing through your body. (+5% club)",
          deactivation: "You feel the power of club leaving your body. (-5% club)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases strength by 5% and club by 5% respectively",
};
