import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIceSword: IEquippableMeleeTier2WeaponBlueprint = {
  key: SwordsBlueprint.IceSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/ice-sword.png",
  name: "Ice Sword",
  description:
    "A sharp and deadly ice sword with a blade so thin it can easily cut through flesh and bone. Its icy edge is capable of causing freezing damage to enemies.",
  attack: 18,
  defense: 16,
  tier: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 53,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 70,
};
