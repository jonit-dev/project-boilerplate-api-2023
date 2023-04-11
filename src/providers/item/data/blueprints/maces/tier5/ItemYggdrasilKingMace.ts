import { IEquippableTwoHandedTier5WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemYggdrasilKingMace: IEquippableTwoHandedTier5WeaponBlueprint = {
  key: MacesBlueprint.YggdrasilKingMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/yggdrasil-king-mace.png",
  name: "Yggdrasil King Mace",
  description:
    "descrThe Yggdrasil King Mace is a heavy, two-handed weapon that exudes an aura of strength and vitality.iption",
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 84,
  defense: 40,
  tier: 5,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
};
