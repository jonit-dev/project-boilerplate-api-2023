import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGlacialSword: IEquippableMeleeTier4WeaponBlueprint = {
  key: SwordsBlueprint.GlacialSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/glacial-sword.png",
  name: "Glacial Sword",
  description:
    "The Glacial Sword is a formidable and awe-inspiring weapon often used by warriors who hail from the icy northern regions of the world",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 32,
  defense: 30,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 80,
};
