import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableTwoHandedTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemYetiHalberd: IEquippableTwoHandedTier4WeaponBlueprint = {
  key: AxesBlueprint.YetiHalberd,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/yeti-halberd.png",
  name: "Yeti's Halberd",
  description:
    "An ice weapon consisting of an ax blade balanced by a pick with an elongated pike head at the end of the staff.",
  attack: 74,
  defense: 36,
  tier: 4,
  weight: 2,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 65,
};
