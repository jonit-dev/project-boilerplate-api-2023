import { IEquippableMeleeTier11WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemNemesisSword: IEquippableMeleeTier11WeaponBlueprint = {
  key: SwordsBlueprint.NemesisSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/nemesis-sword.png",
  name: "Nemesis Sword",
  description:
    "This sword records the names of foes who have defeated its wielder, becoming more effective against them in future encounters.",
  attack: 85,
  defense: 68,
  tier: 11,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 185,
};
