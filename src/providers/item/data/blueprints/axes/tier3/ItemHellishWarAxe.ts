import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHellishWarAxe: IEquippableTwoHandedTier3WeaponBlueprint = {
  key: AxesBlueprint.HellishWarAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/hellish-war-axe.png",
  name: "Hellish War Axe",
  description:
    "The Hellish War Axe is a well-balanced weapon, with a strong Attack rating that can deal devastating blows to enemies.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 52,
  defense: 23,
  tier: 3,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 70,
};
