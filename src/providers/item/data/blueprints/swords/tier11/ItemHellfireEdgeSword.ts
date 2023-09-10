import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableMeleeTier11WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHellfireEdgeSword: IEquippableMeleeTier11WeaponBlueprint = {
  key: SwordsBlueprint.HellfireEdgeSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/hellfire-edge-sword.png",
  name: "Hellfire Edge Sword",
  description: "A sword imbued with infernal magic, feared by even demonic entities.",
  attack: 85,
  defense: 80,
  tier: 11,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 182,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 85,
};
