import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableRangedWeaponTwoHandedBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";
import { RangeTypes } from "../../types/RangedWeaponTypes";

export const itemFrostBow: IEquippableRangedWeaponTwoHandedBlueprint = {
  key: RangedWeaponsBlueprint.FrostBow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/frost-bow.png",
  name: "Frost Bow",
  description: "Ice cristal made bow, formed by the reflection of sunlight from ice crystals floating in the air.",
  weight: 2,
  attack: 13,
  defense: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow],
  isTwoHanded: true,
  basePrice: 87,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 90,
};
