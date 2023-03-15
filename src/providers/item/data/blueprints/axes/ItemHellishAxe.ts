import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHellishAxe: IEquippableWeaponBlueprint = {
  key: AxesBlueprint.HellishAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/hellish-axe.png",
  name: "Hellish Axe",
  description:
    "An axe imbued with dark, otherworldly energy. It is said to be able to set its surroundings on fire and to be capable of cutting through even the toughest materials with ease.",
  attack: 30,
  defense: 8,
  weight: 3.4,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
