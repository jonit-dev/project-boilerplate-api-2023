import { IEquippableTwoHandedTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSkullCrusherMace: IEquippableTwoHandedTier6WeaponBlueprint = {
  key: MacesBlueprint.SkullCrusherMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/skull-crusher-mace.png",
  name: "Skull Crusher Mace",
  description:
    "Designed for maximum impact, this mace is weighted at the head. Great for smashing through armor and bone alike.",
  weight: 3.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 94,
  defense: 44,
  tier: 6,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
};
