import { IEquippableTwoHandedTier5WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSpectralMace: IEquippableTwoHandedTier5WeaponBlueprint = {
  key: MacesBlueprint.SpectralMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/spectral-mace.png",
  name: "Spectral Mace",
  description:
    "A ghostly weapon that phases through armor, making it effective against heavily armored foes. A phantasmal threat.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 78,
  defense: 38,
  isTwoHanded: true,
  tier: 5,
  rangeType: EntityAttackType.Melee,
};
