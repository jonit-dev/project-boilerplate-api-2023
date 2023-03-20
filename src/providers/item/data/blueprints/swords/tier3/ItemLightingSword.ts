import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLightingSword: IEquippableMeleeTier3WeaponBlueprint = {
  key: SwordsBlueprint.LightingSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/lighting-sword.png",
  name: "Lighting Sword",
  description: "A sword imbued with the power of lightning, capable of generating and controlling electrical energy.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 27,
  defense: 23,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
};
