import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemAzureMachete: IEquippableWeaponBlueprint = {
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
  attack: 18,
  defense: 8,
  rangeType: EntityAttackType.Melee,
  basePrice: 87,
};
