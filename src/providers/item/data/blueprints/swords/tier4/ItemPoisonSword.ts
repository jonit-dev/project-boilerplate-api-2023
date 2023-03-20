import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPoisonSword: IEquippableMeleeTier4WeaponBlueprint = {
  key: SwordsBlueprint.PoisonSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/poison-sword.png",
  name: "Poison Sword",
  description: "A sword with a blade coated with deadly poison.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 30,
  defense: 32,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
  entityEffects: [EntityEffectBlueprint.Poison],
  entityEffectChance: 80,
};
