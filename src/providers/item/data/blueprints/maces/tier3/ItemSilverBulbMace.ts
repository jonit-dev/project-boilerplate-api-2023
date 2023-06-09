import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSilverBulbMace: IEquippableMeleeTier3WeaponBlueprint = {
  key: MacesBlueprint.SilverBulbMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/silver-bulb-mace.png",
  name: "Silver Bulb Mace",
  description: "A mace with a silver shaft and a round, bulb-shaped head made of metal.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 27,
  defense: 18,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
};
