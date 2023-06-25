import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCorruptionAxe: IEquippableMeleeTier2WeaponBlueprint = {
  key: AxesBlueprint.CorruptionAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/corruption-axe.png",
  name: "Corruption Axe",
  description:
    "An axe with a blade that is said to be able to cut through any material with ease. It is rumored to be cursed, causing those who wield it to become corrupt and power-hungry.",
  attack: 20,
  defense: 4,
  tier: 2,
  weight: 2,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 47,
  entityEffects: [EntityEffectBlueprint.Corruption],
  entityEffectChance: 70,
};
