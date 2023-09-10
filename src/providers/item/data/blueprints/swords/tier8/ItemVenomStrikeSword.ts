import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableMeleeTier8WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemVenomStrikeSword: IEquippableMeleeTier8WeaponBlueprint = {
  key: SwordsBlueprint.VenomStrikeSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/venom-strike-sword.png",
  name: "Venom Strike Sword",
  description: "A poisonous sword that injects venom into enemies, causing ongoing damage.",
  attack: 64,
  defense: 60,
  tier: 8,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 155,
  entityEffects: [EntityEffectBlueprint.Poison],
  entityEffectChance: 75,
};
