import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHellishVikingAxe: IEquippableMeleeTier3WeaponBlueprint = {
  key: AxesBlueprint.HellishVikingAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/hellish-viking-axe.png",
  name: "Hellish Viking Axe",
  description:
    "The Hellish Viking Axe is a formidable offensive weapon, with a high Attack rating that can cleave through enemies with ease.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  tier: 3,
  attack: 28,
  defense: 23,
  rangeType: EntityAttackType.Melee,
};
