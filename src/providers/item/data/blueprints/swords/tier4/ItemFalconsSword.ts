import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFalconsSword: IEquippableMeleeTier4WeaponBlueprint = {
  key: SwordsBlueprint.FalconsSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/falcons-sword.png",
  name: "Falcon's Sword",
  description:
    "The Falcon's Sword is a graceful and deadly weapon often used by knights and other chivalrous warriors who embody the virtues of bravery and honor.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 32,
  defense: 30,
  tier: 4,
  rangeType: EntityAttackType.Melee,
};
