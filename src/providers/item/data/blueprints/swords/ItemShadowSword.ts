import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemShadowSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.ShadowSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/shadow-sword.png",
  name: "Shadow Sword",
  description: "A sword infused with shadow magic that deals extra damage to enemies weak to darkness.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 30,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 80,
};
