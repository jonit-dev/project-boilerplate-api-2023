import { IEquippableMeleeTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemElucidatorSword: IEquippableMeleeTier10WeaponBlueprint = {
  key: SwordsBlueprint.ElucidatorSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/elucidator-sword.png",
  name: "Elucidator Sword",
  description: "A jet-black sword, legendary for its devastating power and mystical origins.",
  attack: 75,
  defense: 62,
  tier: 10,
  weight: 1.3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 180,
};
