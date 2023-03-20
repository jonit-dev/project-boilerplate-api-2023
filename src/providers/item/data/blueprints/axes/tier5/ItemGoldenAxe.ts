import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableTwoHandedTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGoldenAxe: IEquippableTwoHandedTier5WeaponBlueprint = {
  key: AxesBlueprint.GoldenAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/golden-axe.png",
  name: "Golden Axe",
  description:
    "An axe with a golden blade and handle. It is often given as a symbol of honor or status, and is said to be a powerful weapon in the hands of a skilled warrior.",
  attack: 90,
  defense: 40,
  tier: 5,
  weight: 2.4,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 67,
};
