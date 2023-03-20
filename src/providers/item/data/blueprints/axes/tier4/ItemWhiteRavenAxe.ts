import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWhiteRavenAxe: IEquippableMeleeTier4WeaponBlueprint = {
  key: AxesBlueprint.WhiteRavenAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/white-raven-axe.png",
  name: "White Raven Axe",
  description:
    "A mysterious white axe with a metal head and a handle adorned with black feathers, used by shamans to commune with the spirit world.",
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 30,
  defense: 8,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 62,
};