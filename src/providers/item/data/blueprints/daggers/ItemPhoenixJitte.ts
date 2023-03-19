import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPhoenixJitte: IEquippableWeaponBlueprint = {
  key: DaggersBlueprint.PhoenixJitte,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/phoenix-jitte.png",
  name: "Phoenix Jitte",
  description:
    "The Phoenix Jitte is a unique and ornate weapon, adorned with intricate gold that resemble the fiery bird from which it takes its name. The blade is made of a rare and durable metal, with a sharp edge that can deflect blows and disarm opponents.",
  weight: 0.9,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 67,
};
