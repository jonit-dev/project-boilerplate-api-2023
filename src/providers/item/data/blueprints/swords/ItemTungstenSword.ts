import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemTungstenSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.TungstenSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/tungsten-sword.png",
  name: "Tungsten Sword",
  description: "A strong sword made of tungsten, suitable for mid to late game battles against stronger enemies.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 18,
  defense: 12,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
};
