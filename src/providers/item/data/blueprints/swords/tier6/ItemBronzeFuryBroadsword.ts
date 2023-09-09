import { IEquippableMeleeTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBronzeFuryBroadsword: IEquippableMeleeTier6WeaponBlueprint = {
  key: SwordsBlueprint.BronzeFuryBroadsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/bronze-fury-broadsword.png",
  name: "Bronze Fury Broadsword",
  description:
    "A sword that thrives in the heat of battle; the more enemies you face, the fiercer it burns, giving you increased power.",
  attack: 48,
  defense: 44,
  tier: 6,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 130,
};
