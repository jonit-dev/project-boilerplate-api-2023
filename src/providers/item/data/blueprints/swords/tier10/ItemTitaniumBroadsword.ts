import { IEquippableMeleeTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemTitaniumBroadsword: IEquippableMeleeTier10WeaponBlueprint = {
  key: SwordsBlueprint.TitaniumBroadsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/titanium-broadsword.png",
  name: "Titanium Broadsword",
  description:
    "Forged from a rare metal, this sword can cut through almost any material with ease, ignoring enemy armor.",
  attack: 72,
  defense: 50,
  tier: 10,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 170,
};
