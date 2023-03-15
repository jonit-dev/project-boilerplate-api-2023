import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBloodstainedCenser: IEquippableWeaponBlueprint = {
  key: MacesBlueprint.BloodstainedCenser,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/bloodstained-censer.png",
  name: "Bloodstained Censer",
  description:
    "A mace with a brown wooden handle and a head that is shaped like a cross, made of brass or bronze and adorned with blood-red gems or crystals.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 22,
  defense: 8,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
