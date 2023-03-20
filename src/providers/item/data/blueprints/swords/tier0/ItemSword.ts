import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSword: IEquippableMeleeTier0WeaponBlueprint = {
  key: SwordsBlueprint.Sword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/sword.png",
  name: "Sword",
  description:
    "A standard weapon with a long, sharp blade and a hilt for grip, suitable for a variety of combat situations.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 8,
  defense: 7,
  tier: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 68,
};
