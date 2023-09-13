import { IEquippableMeleeTier12WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEmeraldBroadsword: IEquippableMeleeTier12WeaponBlueprint = {
  key: SwordsBlueprint.EmeraldBroadsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/emerald-broadsword.png",
  name: "Emerald Broadsword",
  description:
    "Adorned with priceless emeralds said to be tears of the Earth Goddess, this broadsword can amplify the wielders earth-based magics to an unparalleled level.",
  attack: 92,
  defense: 80,
  tier: 12,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 200,
};
