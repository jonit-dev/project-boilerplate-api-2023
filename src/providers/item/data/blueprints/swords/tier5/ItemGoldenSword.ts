import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGoldenSword: IEquippableMeleeTier5WeaponBlueprint = {
  key: SwordsBlueprint.GoldenSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/golden-sword.png",
  name: "Golden Sword",
  description:
    "A luxurious sword made of gleaming gold, often associated with wealth, power, and nobility. It is imbued with magical energy and is highly prized for its beauty and rarity.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 42,
  defense: 38,
  tier: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 220,
};
