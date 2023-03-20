import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEnchantedSword: IEquippableMeleeTier4WeaponBlueprint = {
  key: SwordsBlueprint.EnchantedSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/enchanted-sword.png",
  name: "Enchanted Sword",
  description:
    "A magical sword imbued with powerful enchantments, capable of channeling potent spells and incantations.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 30,
  defense: 28,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
};
