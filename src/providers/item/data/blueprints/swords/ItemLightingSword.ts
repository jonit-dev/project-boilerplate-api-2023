import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightingSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.LightingSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/lighting-sword.png",
  name: "Lighting Sword",
  description: "A sword imbued with the power of lightning, capable of generating and controlling electrical energy.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 20,
  defense: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
};
