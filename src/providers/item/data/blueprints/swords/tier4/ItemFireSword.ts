import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFireSword: IEquippableMeleeTier4WeaponBlueprint = {
  key: SwordsBlueprint.FireSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/fire-sword.png",
  name: "Fire Sword",
  description:
    "A sword imbued with the power of flames, capable of unleashing fiery attacks and generating intense heat.",
  attack: 36,
  defense: 32,
  tier: 4,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 74,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 70,
  equippedBuff: {
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
  equippedBuffDescription: "Increases strength by 10%",
};
