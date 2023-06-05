import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMithrilSword: IEquippableMeleeTier4WeaponBlueprint = {
  key: SwordsBlueprint.MithrilSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/mithril-sword.png",
  name: "Mithril Sword",
  description:
    "A sword made of mithril, a fictional metal known for its strength and light weight. It is a highly prized weapon for its balance of power and speed.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 32,
  defense: 30,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
