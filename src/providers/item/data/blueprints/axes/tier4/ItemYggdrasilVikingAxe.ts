import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemYggdrasilVikingAxe: IEquippableMeleeTier4WeaponBlueprint = {
  key: AxesBlueprint.YggdrasilVikingAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/yggdrasil-viking-axe.png",
  name: "Yggdrasil Viking Axe",
  description:
    "The Yggdrasil Viking Axe is a well-balanced weapon, with a moderate Attack rating that can be augmented by the wielder`s skill and strength.",
  weight: 3.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 36,
  defense: 30,
  tier: 4,
  rangeType: EntityAttackType.Melee,
};
