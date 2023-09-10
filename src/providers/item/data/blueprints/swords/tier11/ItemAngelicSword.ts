import { IEquippableMeleeTier11WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemAngelicSword: IEquippableMeleeTier11WeaponBlueprint = {
  key: SwordsBlueprint.AngelicSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/angelic-sword.png",
  name: "Angelic Sword",
  description: "A divine blade imbued with heavenly power, often used for smiting evil forces.",
  attack: 80,
  defense: 78,
  tier: 11,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 182,
};
