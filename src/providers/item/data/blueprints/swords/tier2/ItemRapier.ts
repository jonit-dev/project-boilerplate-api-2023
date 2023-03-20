import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRapier: IEquippableMeleeTier2WeaponBlueprint = {
  key: SwordsBlueprint.Rapier,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/rapier.png",
  name: "Rapier",
  description:
    "A sleek and slender sword with a pointed and sharp blade, designed for precise and rapid thrusting attacks.",
  weight: 0.75,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 16,
  tier: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};