import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemShadowSword: IEquippableMeleeTier3WeaponBlueprint = {
  key: SwordsBlueprint.ShadowSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/shadow-sword.png",
  name: "Shadow Sword",
  description: "A sword infused with shadow magic that deals extra damage to enemies weak to darkness.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 28,
  defense: 28,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 80,
};
