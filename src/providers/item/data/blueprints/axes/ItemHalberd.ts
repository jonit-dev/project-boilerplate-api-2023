import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHalberd: IEquippableWeaponBlueprint = {
  key: AxesBlueprint.Halberd,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/halberd.png",
  name: "Halberd",
  description:
    "A weapon consisting of an ax blade balanced by a spearhead on a long wooden or metal shaft. It is often used by infantry to defend against cavalry.",
  attack: 32,
  defense: 6,
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 62,
};
