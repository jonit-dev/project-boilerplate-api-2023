import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableRangedTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHellishBow: IEquippableRangedTier4WeaponBlueprint = {
  key: RangedWeaponsBlueprint.HellishBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/hellish-bow.png",
  name: "Hellish Bow",
  description:
    "A bow imbued with dark, otherworldly energy. It is said to be able to ignite the air around it and to be capable of shooting hellish bolts with great force and accuracy.",
  attack: 32,
  tier: 4,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.PoisonArrow,
    RangedWeaponsBlueprint.ShockArrow,
  ],
  isTwoHanded: true,
  basePrice: 70,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 90,
};
