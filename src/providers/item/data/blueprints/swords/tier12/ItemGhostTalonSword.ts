import { IEquippableMeleeTier12WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGhostTalonSword: IEquippableMeleeTier12WeaponBlueprint = {
  key: SwordsBlueprint.GhostTalonSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/ghost-talon-sword.png",
  name: "Ghost Talon Sword",
  description:
    "his ethereal blade, forged by restless spirits, allows the wielder to summon ghosts to distract and terrify enemies.",
  attack: 88,
  defense: 80,
  tier: 12,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 200,
};
