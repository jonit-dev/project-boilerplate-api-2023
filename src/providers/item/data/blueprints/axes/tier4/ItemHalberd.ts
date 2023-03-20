import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableTwoHandedTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHalberd: IEquippableTwoHandedTier4WeaponBlueprint = {
  key: AxesBlueprint.Halberd,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/halberd.png",
  name: "Halberd",
  description:
    "A weapon consisting of an ax blade balanced by a spearhead on a long wooden or metal shaft. It is often used by infantry to defend against cavalry.",
  attack: 68,
  defense: 35,
  isTwoHanded: true,
  tier: 4,
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 62,
};
