import { IEquippableMeleeTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSpiritBlade: IEquippableMeleeTier9WeaponBlueprint = {
  key: DaggersBlueprint.SpiritBlade,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/spirit-blade.png",
  name: "Spirit Blade",
  description:
    "Engraved with ancient runes, this dagger calls upon ancestral spirits to assist in battle, granting strength and wisdom.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 70,
  defense: 68,
  tier: 9,
  rangeType: EntityAttackType.Melee,
  basePrice: 81,
};
