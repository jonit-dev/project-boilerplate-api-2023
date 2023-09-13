import { IEquippableMeleeTier8WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMoonshadeSword: IEquippableMeleeTier8WeaponBlueprint = {
  key: SwordsBlueprint.MoonshadeSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/moonshade-sword.png",
  name: "Moonshade Sword",
  description: "A sword that gains power under the moonlight, ideal for nocturnal missions.",
  attack: 58,
  defense: 45,
  tier: 8,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 145,
};
