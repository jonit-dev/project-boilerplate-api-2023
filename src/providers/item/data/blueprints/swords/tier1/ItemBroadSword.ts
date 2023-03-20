import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBroadSword: IEquippableMeleeTier1WeaponBlueprint = {
  key: SwordsBlueprint.BroadSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/broad-sword.png",
  name: "Broad Sword",
  description: "A massive two-handed iron sword with a wide and heavy blade, capable of delivering devastating blows.",
  attack: 15,
  defense: 12,
  tier: 1,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 61,
};
