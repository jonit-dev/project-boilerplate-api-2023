import { IEquippableMeleeTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRoyalGuardianSword: IEquippableMeleeTier10WeaponBlueprint = {
  key: SwordsBlueprint.RoyalGuardianSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/royal-guardian-sword.png",
  name: "Royal Guardian Sword",
  description: "An ornate sword reserved for elite protectors of the realm, infused with regal magic.",
  attack: 78,
  defense: 78,
  tier: 10,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 180,
};
