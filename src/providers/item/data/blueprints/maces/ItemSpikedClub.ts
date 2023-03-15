import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { MacesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSpikedClub: IEquippableWeaponBlueprint = {
  key: MacesBlueprint.SpikedClub,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/spiked-club.png",

  name: "Spiked club",
  description: "A simple wooden club with metal spikes.",
  attack: 13,
  defense: 4,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 65,
};
