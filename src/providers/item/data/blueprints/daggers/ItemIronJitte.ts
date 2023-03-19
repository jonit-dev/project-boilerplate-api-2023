import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronJitte: IEquippableWeaponBlueprint = {
  key: DaggersBlueprint.IronJitte,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/iron-jitte.png",
  name: "Iron Jitte",
  description:
    "Its long shaft is made of iron, giving it a weighty feel and a sleek, metallic appearance. The central grip is wrapped in sturdy leather, providing a secure grip, while the blade is sharp and pointed, capable of delivering deadly strikes.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 6,
  defense: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 40,
};
