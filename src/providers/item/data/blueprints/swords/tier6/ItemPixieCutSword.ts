import { IEquippableMeleeTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPixieCutSword: IEquippableMeleeTier6WeaponBlueprint = {
  key: SwordsBlueprint.PixieCutSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/pixie-cut-sword.png",
  name: "Pixie Cut Sword",
  description: "Imbued with fey magic, this small sword is as whimsical as it is deadly.",
  attack: 48,
  defense: 40,
  tier: 6,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 135,
};
