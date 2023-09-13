import { IEquippableMeleeTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemThunderStrikeSword: IEquippableMeleeTier9WeaponBlueprint = {
  key: SwordsBlueprint.ThunderStrikeSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/thunder-strike-sword.png",
  name: "Thunder Strike Sword",
  description: "A blade charged with electrical energy that can paralyze enemies.",
  attack: 68,
  defense: 65,
  tier: 9,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 160,
};
