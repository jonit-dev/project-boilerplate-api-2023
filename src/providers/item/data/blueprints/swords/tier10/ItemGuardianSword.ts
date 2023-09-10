import { IEquippableMeleeTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGuardianSword: IEquippableMeleeTier10WeaponBlueprint = {
  key: SwordsBlueprint.GuardianSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/guardian-sword.png",
  name: "Guardian Sword",
  description:
    "Designed for knights sworn to protect, this sword erects an invisible barrier that shields allies from attacks.",
  attack: 75,
  defense: 72,
  tier: 10,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 170,
};
