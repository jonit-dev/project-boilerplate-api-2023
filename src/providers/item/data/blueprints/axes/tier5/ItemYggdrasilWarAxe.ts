import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemYggdrasilWarAxe: IEquippableTwoHandedTier5WeaponBlueprint = {
  key: AxesBlueprint.YggdrasilWarAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/yggdrasil-war-axe.png",
  name: "Yggdrasil War Axe",
  description: "The Yggdrasil War Axe is a heavy, two-handed weapon designed for maximum damage output.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 86,
  defense: 37,
  tier: 5,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Strength,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of strength flowing through your body. (+10% Strength)",
          deactivation: "You feel the power of strength leaving your body. (-10% Strength)",
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
  equippedBuffDescription: "Increases strength by 10% and max health by 5% respectively",
};
