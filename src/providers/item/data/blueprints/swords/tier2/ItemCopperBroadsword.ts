import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCopperBroadsword: IEquippableMeleeTier2WeaponBlueprint = {
  key: SwordsBlueprint.CopperBroadsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/copper-broadsword.png",
  name: "Copper broadsword",
  description: "A basic sword made of copper, suitable for early game battles against weaker enemies.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 18,
  defense: 14,
  tier: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
