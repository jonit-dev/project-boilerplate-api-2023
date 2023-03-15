import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMithrilSword: IEquippableWeaponBlueprint = {
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
  attack: 18,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
