import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableMeleeTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostBiteDagger: IEquippableMeleeTier7WeaponBlueprint = {
  key: DaggersBlueprint.FrostBiteDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/frost-bite-dagger.png",
  name: "Frost Bite Dagger",
  description:
    "Encased in a layer of unmelting frost, this dagger numbs foes upon contact, slowing their movements and making them more susceptible to subsequent attacks.",
  weight: 1.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 56,
  defense: 51,
  tier: 7,
  rangeType: EntityAttackType.Melee,
  basePrice: 66,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 85,
};
