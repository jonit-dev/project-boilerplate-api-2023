import { IEquippableTwoHandedTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGuardianGlaive: IEquippableTwoHandedTier6WeaponBlueprint = {
  key: SpearsBlueprint.GuardianGlaive,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/guardian-glaive.png",
  name: "Guardian Glaive",
  description: "With a defensive shorter arm designed to parry blows, this spear ensures both offense and defense.",
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 102,
  defense: 48,
  tier: 6,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 65,
};
