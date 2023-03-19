import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDamascusJitte: IEquippableWeaponBlueprint = {
  key: DaggersBlueprint.DamascusJitte,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/damascus-jitte.png",
  name: "Damascus Jitte",
  description:
    "The Damascus Jitte is a finely-crafted weapon made from Damascus steel, renowned for its exceptional durability and unique patterned appearance. The blade is sleek and slender, with a sharp point for precise strikes.",
  weight: 1.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 10,
  defense: 7,
  rangeType: EntityAttackType.Melee,
  basePrice: 52,
};
