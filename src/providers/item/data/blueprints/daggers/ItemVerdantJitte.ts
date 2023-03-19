import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemVerdantJitte: IEquippableWeaponBlueprint = {
  key: DaggersBlueprint.VerdantJitte,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/verdant-jitte.png",
  name: "Verdant Jitte",
  description:
    "The Verdant Jitte is a weapon that embodies the beauty and power of nature. Its long shaft and blade are made entirely of an iridescent green metal that shimmers in the light, resembling freshly sprouted leaves.",
  weight: 1.3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 66,
};
