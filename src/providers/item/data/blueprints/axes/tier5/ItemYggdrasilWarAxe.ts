import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemYggdrasilWarAxe: IEquippableTwoHandedTier5WeaponBlueprint = {
  key: AxesBlueprint.YggdrasilWarAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/yggdrasil-war-axe.png",
  name: "Yggdrasil War Axe",
  description: "The Yggdrasil War Axe is a heavy, two-handed weapon designed for maximum damage output.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 86,
  defense: 37,
  tier: 5,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
};
