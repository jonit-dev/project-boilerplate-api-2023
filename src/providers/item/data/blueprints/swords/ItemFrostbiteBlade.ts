import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFrostbiteBlade: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.FrostbiteBlade,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/frostbite-blade.png",
  name: "Frostbite Blade",
  description:
    "A sword with a white blade made of enchanted ice, and a hilt made of blue-tinted metal in the shape of a frostbitten tree branch.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 13,
  defense: 6,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
