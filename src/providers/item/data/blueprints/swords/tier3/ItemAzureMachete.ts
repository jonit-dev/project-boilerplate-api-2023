import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemAzureMachete: IEquippableMeleeTier3WeaponBlueprint = {
  key: SwordsBlueprint.AzureMachete,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/azure-machete.png",
  name: "Azure Machete",
  description:
    "The Azure Machete is a fearsome weapon made from high-quality iron with a blue line running down its length. The blade is long and curved, with a sharp edge that gleams in the light.",
  weight: 1.3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 24,
  defense: 23,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 87,
};
