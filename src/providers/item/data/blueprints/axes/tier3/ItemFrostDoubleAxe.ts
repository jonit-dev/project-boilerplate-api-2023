import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableTwoHandedTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostDoubleAxe: IEquippableTwoHandedTier3WeaponBlueprint = {
  key: AxesBlueprint.FrostDoubleAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/frost-double-axe.png",

  name: "Frost Double Axe",
  description: "A large master-crafted weapon with a frosted blade.",
  attack: 54,
  defense: 28,
  tier: 3,
  weight: 1.8,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 90,
};
