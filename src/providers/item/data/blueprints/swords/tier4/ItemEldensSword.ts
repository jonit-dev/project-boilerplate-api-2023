import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEldensSword: IEquippableMeleeTier4WeaponBlueprint = {
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
  attack: 30,
  defense: 32,
  tier: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
};
