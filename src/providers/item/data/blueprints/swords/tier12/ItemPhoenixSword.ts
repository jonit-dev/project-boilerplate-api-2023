import { IEquippableMeleeTier12WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPhoenixSword: IEquippableMeleeTier12WeaponBlueprint = {
  key: SwordsBlueprint.PhoenixSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/phoenix-sword.png",
  name: "Phoenix Sword",
  description:
    "This sword, imbued with the essence of a phoenix, bursts into flame upon command and can heal the wielder over time.",
  attack: 90,
  defense: 85,
  tier: 12,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 200,
};
