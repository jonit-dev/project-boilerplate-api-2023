import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEarthbinderSpear: IEquippableTwoHandedTier4WeaponBlueprint = {
  key: SpearsBlueprint.EarthbinderSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/earthbinder-spear.png",
  name: "Earthbinder Spear",
  description: "A long spear with a brown wooden shaft and a spearhead made of stone or obsidian.",
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 62,
  defense: 35,
  tier: 4,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
};
