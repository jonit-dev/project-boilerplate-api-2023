import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSapphireDagger: IEquippableMeleeTier3WeaponBlueprint = {
  key: DaggersBlueprint.SapphireDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/sapphire-dagger.png",
  name: "Sapphire Dagger",
  description:
    "The Sapphire Dagger is a beautiful and deadly weapon, featuring a blade made entirely of sapphire. The blade has a deep blue color and is sharp enough to cut through most materials. Is a rare and valuable weapon that is sought after by collectors and adventurers alike.",
  weight: 0.9,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 27,
  defense: 23,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
