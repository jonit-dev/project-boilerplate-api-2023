import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBloodstainedCenser: IEquippableMeleeTier4WeaponBlueprint = {
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
  attack: 30,
  defense: 10,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
