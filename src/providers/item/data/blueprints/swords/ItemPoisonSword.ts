import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.PoisonSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/poison-sword.png",
  name: "Poison Sword",
  description: "A sword with a blade coated with deadly poison.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 18,
  defense: 7,
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
};
