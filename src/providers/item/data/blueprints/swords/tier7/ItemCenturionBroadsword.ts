import { IEquippableMeleeTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCenturionBroadsword: IEquippableMeleeTier7WeaponBlueprint = {
  key: SwordsBlueprint.CenturionBroadsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/centurion-broadsword.png",
  name: "Centurion Broadsword",
  description:
    "Crafted for the leaders of bronze-aged armies, this broadsword boosts morale, increasing allies combat effectiveness.",
  attack: 57,
  defense: 55,
  tier: 7,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 145,
};
