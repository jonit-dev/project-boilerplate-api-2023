import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableTwoHandedTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHellishAxe: IEquippableTwoHandedTier4WeaponBlueprint = {
  key: AxesBlueprint.HellishAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/hellish-axe.png",
  name: "Hellish Axe",
  description:
    "An axe imbued with dark, otherworldly energy. It is said to be able to set its surroundings on fire and to be capable of cutting through even the toughest materials with ease.",
  attack: 70,
  defense: 34,
  tier: 4,
  weight: 3.4,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 70,
};
