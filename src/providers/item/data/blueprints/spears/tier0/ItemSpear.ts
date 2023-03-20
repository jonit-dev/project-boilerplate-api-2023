import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableTwoHandedTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSpear: IEquippableTwoHandedTier0WeaponBlueprint = {
  key: SpearsBlueprint.Spear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/spear.png",
  name: "Spear",
  description:
    "A standard wooden spear with a metal tip, used as a basic melee weapon. It is a simple yet effective weapon that can be used for thrusting and poking attacks.",
  attack: 14,
  defense: 6,
  tier: 0,
  weight: 3,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 45,
};
