import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostguardSword: IEquippableMeleeTier3WeaponBlueprint = {
  key: SwordsBlueprint.FrostguardSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/frostguard-sword.png",
  name: "Frostguard Sword",
  description:
    "A sword with a white blade and a curved handguard made of blue-tinted steel, designed to resemble icy shards or icicles.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 24,
  defense: 23,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 70,
};
