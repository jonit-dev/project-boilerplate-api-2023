import { EntityAttackType, ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { IEquippableRangedTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemScythianGoldenBow: IEquippableRangedTier4WeaponBlueprint = {
  key: RangedWeaponsBlueprint.ScythianGoldenBow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/scythian-golden-bow.png",
  name: "Scythian Golden Bow",
  description:
    "The Scythian Golden Bow is a ranged weapon that excels at dealing precise and deadly attacks from a distance.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 35,
  tier: 4,
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.PoisonArrow,
    RangedWeaponsBlueprint.ShockArrow,
  ],
  isTwoHanded: true,
  rangeType: EntityAttackType.Ranged,
};
