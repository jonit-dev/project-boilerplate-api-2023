import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemKnightsSword: IEquippableMeleeTier3WeaponBlueprint = {
  key: SwordsBlueprint.KnightsSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/knights-sword.png",
  name: "Knights Sword",
  description: "A well-crafted sword used by medieval knights, known for its durability and effectiveness in battle.",
  attack: 23,
  defense: 23,
  tier: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
};
