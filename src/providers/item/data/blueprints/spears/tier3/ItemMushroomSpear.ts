import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMushroomSpear: IEquippableTwoHandedTier3WeaponBlueprint = {
  key: SpearsBlueprint.MushroomSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/mushroom-spear.png",
  name: "Mushroom Spear",
  description:
    "A spear tipped with a mushroom cap for poison damage, making it effective against enemies with high health.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 48,
  defense: 27,
  tier: 3,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
