import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMushroomSpear: IEquippableWeaponBlueprint = {
  key: SpearsBlueprint.MushroomSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/mushroom-spear.png",
  name: "Mushroom Spear",
  description:
    "A spear tipped with a mushroom cap for poison damage, making it effective against enemies with high health.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 20,
  defense: 13,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
