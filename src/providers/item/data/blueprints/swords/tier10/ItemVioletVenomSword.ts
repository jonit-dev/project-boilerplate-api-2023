import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableMeleeTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemVioletVenomSword: IEquippableMeleeTier10WeaponBlueprint = {
  key: SwordsBlueprint.VioletVenomSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/violet-venom-sword.png",
  name: "Violet Venom Sword",
  description:
    "This blade has a purple venom coating that inflicts a debilitating poison upon foes, weakening them over time.",
  attack: 76,
  defense: 70,
  tier: 10,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 180,
  entityEffects: [EntityEffectBlueprint.Poison],
  entityEffectChance: 90,
};
