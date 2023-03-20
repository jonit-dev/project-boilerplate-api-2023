import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSaber: IEquippableMeleeTier2WeaponBlueprint = {
  key: SwordsBlueprint.Saber,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/saber.png",
  name: "Saber",
  description: "A curved sword with a single-edged blade, optimized for fast and agile combat.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 16,
  tier: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
};
