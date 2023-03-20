import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemAzureDagger: IEquippableMeleeTier4WeaponBlueprint = {
  key: DaggersBlueprint.AzureDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/azure-dagger.png",
  name: "Azure Dagger",
  description:
    "The Azure Dagger is a sleek and deadly weapon made from high-quality iron with a blue line running down its length. The blade is razor-sharp, with a finely honed edge that gleams in the light.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 30,
  defense: 30,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 59,
};
