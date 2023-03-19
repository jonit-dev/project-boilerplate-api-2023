import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCopperJitte: IEquippableWeaponBlueprint = {
  key: DaggersBlueprint.CopperJitte,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/copper-jitte.png",
  name: "Copper Jitte",
  description:
    " The Copper Jitte is a unique and ornate weapon that features a long shaft made entirely of copper, topped with a pair of prongs at the end. The prongs are designed to trap and disarm an opponent's weapon.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 8,
  defense: 6,
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
};
