import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemVerdantDagger: IEquippableMeleeTier4WeaponBlueprint = {
  key: DaggersBlueprint.VerdantDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/verdant-dagger.png",
  name: "Verdant Dagger",
  description:
    "The Verdant Dagger is a weapon made for those who appreciate the beauty of nature. Its blade is made of an iridescent green metal that shimmers in the light, resembling a freshly sprouted leaf.",
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 34,
  defense: 32,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 68,
  entityEffects: [EntityEffectBlueprint.Poison],
  entityEffectChance: 90,
};
