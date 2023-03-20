import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIronwoodTanto: IEquippableMeleeTier1WeaponBlueprint = {
  key: SwordsBlueprint.IronwoodTanto,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/ironwood-tanto.png",
  name: "Ironwood Tanto",
  description: "A small, sharp blade with a brown blade made of ironwood, with a handle wrapped in brown leather.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 13,
  tier: 1,
  rangeType: EntityAttackType.Melee,
  basePrice: 79,
};
