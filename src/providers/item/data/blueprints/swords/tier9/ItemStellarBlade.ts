import { IEquippableMeleeTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStellarBlade: IEquippableMeleeTier9WeaponBlueprint = {
  key: SwordsBlueprint.StellarBlade,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/stellar-blade.png",
  name: "Stellar Blade",
  description:
    "Made from a fallen meteorite, this sword stores cosmic energy, allowing for a single devastating attack each day.",
  attack: 65,
  defense: 52,
  tier: 9,
  weight: 0.8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 165,
};
