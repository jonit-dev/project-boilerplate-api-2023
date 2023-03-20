import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemKunai: IEquippableMeleeTier3WeaponBlueprint = {
  key: DaggersBlueprint.Kunai,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/kunai.png",
  name: "Kunai",
  description:
    "A Japanese knife with a blunt, triangular tip and a long, straight handle. It is often used as a throwing weapon, but can also be used in close combat.",
  weight: 0.7,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 24,
  defense: 25,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 59,
};
