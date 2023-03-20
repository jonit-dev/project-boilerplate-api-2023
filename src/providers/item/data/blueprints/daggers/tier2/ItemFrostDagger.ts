import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostDagger: IEquippableMeleeTier2WeaponBlueprint = {
  key: DaggersBlueprint.FrostDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/frost-dagger.png",

  name: "Frost Dagger",
  description: "A dagger so cold that even holding it sends a chilling sensation down your spine.",
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 16,
  tier: 2,
  weight: 1,
  rangeType: EntityAttackType.Melee,
  basePrice: 45,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 80,
};
