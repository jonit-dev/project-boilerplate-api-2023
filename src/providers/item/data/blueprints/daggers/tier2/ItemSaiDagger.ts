import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSaiDagger: IEquippableMeleeTier2WeaponBlueprint = {
  key: DaggersBlueprint.SaiDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/sai-dagger.png",
  name: "Sai Dagger",
  description:
    "A Japanese weapon consisting of a pointed, prong-shaped blade mounted on a long handle. It is often used for thrusting and parrying, and is known for its versatility in close combat.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 19,
  defense: 16,
  tier: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 49,
};
