import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGlacialAxe: IEquippableTwoHandedTier4WeaponBlueprint = {
  key: AxesBlueprint.GlacialAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/glacial-axe.png",
  name: "Glacial Axe",
  description:
    " The blade is razor-sharp and can cut through even the toughest armor and shields, while the ice crystals that make up the handle provide a firm grip and can also deal additional cold damage to opponents.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 62,
  defense: 30,
  tier: 4,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
};
