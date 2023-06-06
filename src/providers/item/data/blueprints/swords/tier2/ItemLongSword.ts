import {
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableMeleeTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLongSword: IEquippableMeleeTier2WeaponBlueprint = {
  key: SwordsBlueprint.LongSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/long-sword.png",
  name: "Long Sword",
  description: "A sword with a long, slender blade, favored for its versatility and reach in combat.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 20,
  defense: 18,
  tier: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
  equippedBuff: {
    type: CharacterBuffType.Skill,
    trait: CombatSkill.Sword,
    buffPercentage: 5,
    durationType: CharacterBuffDurationType.Permanent,
    options: {
      messages: {
        activation: "You feel the power of sword flowing through your body. (+5% sword)",
        deactivation: "You feel the power of sword leaving your body. (-5% sword)",
      },
    },
  },
  equippedBuffDescription: "Increases sword by 5%",
};
