import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIceShardLongsword: IEquippableMeleeTier4WeaponBlueprint = {
  key: SwordsBlueprint.IceShardLongsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/ice-shard-longsword.png",
  name: "Ice Shard Longsword",
  description:
    "A long sword with a white blade and a blue ricasso, with a hilt made of blue-tinted metal in the shape of a jagged ice shard.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 30,
  defense: 30,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 80,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 90,
};
