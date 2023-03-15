import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSaber: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.Saber,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/saber.png",
  name: "Saber",
  description: "A curved sword with a single-edged blade, optimized for fast and agile combat.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
};
