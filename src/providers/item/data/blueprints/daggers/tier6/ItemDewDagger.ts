import { IEquippableMeleeTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDewDagger: IEquippableMeleeTier6WeaponBlueprint = {
  key: DaggersBlueprint.DewDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/dew-dagger.png",
  name: "Dew Dagger",
  description:
    "A magical dagger imbued with elemental water magic, capable of healing wounds and obscuring vision with a mist upon striking.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 48,
  defense: 44,
  tier: 6,
  rangeType: EntityAttackType.Melee,
  basePrice: 59,
};
