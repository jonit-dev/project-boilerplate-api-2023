import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWoodenSword: IEquippableMeleeTier0WeaponBlueprint = {
  key: SwordsBlueprint.WoodenSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/wooden-sword.png",
  name: "Training Sword",
  description:
    "A weapon with a long, pointed blade used for thrusting and cutting, often with a handle and guard made of wood.",
  weight: 0.75,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 1,
  defense: 1,
  tier: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 40,
  isTraining: true,
};
