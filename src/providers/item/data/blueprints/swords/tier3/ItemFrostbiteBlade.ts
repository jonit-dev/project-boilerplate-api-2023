import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostbiteBlade: IEquippableMeleeTier3WeaponBlueprint = {
  key: SwordsBlueprint.FrostbiteBlade,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/frostbite-blade.png",
  name: "Frostbite Blade",
  description:
    "A sword with a white blade made of enchanted ice, and a hilt made of blue-tinted metal in the shape of a frostbitten tree branch.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 24,
  defense: 20,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 80,
};
