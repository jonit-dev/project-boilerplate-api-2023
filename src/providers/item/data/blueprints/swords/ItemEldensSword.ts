import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEldensSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.EldensSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/elden's-sword.png",
  name: "Eldens Sword",
  description:
    "A mythical sword said to be associated with the Eldens, a powerful and ancient race. It is imbued with powerful magical energy.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
};
