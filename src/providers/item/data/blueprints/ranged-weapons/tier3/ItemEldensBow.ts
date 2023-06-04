import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangeTypes } from "../../../types/RangedWeaponTypes";
import { IEquippableRangedTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEldensBow: IEquippableRangedTier3WeaponBlueprint = {
  key: RangedWeaponsBlueprint.EldensBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/elden's-bow.png",
  name: "Elden's Bow",
  description:
    "A powerful, enchanted bow said to have belonged to a great hero of legend. It is said to be capable of shooting arrows with incredible speed and accuracy.",
  attack: 25,
  tier: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.PoisonArrow,
    RangedWeaponsBlueprint.FrostArrow,
  ],
  isTwoHanded: true,
  basePrice: 65,
};
