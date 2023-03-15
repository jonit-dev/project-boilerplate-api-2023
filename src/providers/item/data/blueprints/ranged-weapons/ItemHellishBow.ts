import { IEquippableRangedWeaponTwoHandedBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangeTypes } from "../../types/RangedWeaponTypes";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHellishBow: IEquippableRangedWeaponTwoHandedBlueprint = {
  key: RangedWeaponsBlueprint.HellishBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/hellish-bow.png",
  name: "Hellish Bow",
  description:
    "A bow imbued with dark, otherworldly energy. It is said to be able to ignite the air around it and to be capable of shooting hellish bolts with great force and accuracy.",
  attack: 14,
  defense: 6,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow],
  isTwoHanded: true,
  basePrice: 70,
};
