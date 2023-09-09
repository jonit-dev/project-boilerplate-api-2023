import { IEquippableTwoHandedTier4WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWitchBaneMace: IEquippableTwoHandedTier4WeaponBlueprint = {
  key: MacesBlueprint.WitchBaneMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/witch-bane-mace.png",
  name: "Witch Bane Mace",
  description: "Designed for witch-hunting, this mace is highly effective against magical creatures and spellcasters.",
  weight: 4.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 62,
  defense: 36,
  tier: 4,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
};
