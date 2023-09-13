import { IEquippableMeleeTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGorgonBlade: IEquippableMeleeTier9WeaponBlueprint = {
  key: SwordsBlueprint.GorgonBlade,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/gorgon-blade.png",
  name: "Gorgon Blade",
  description: "A rare blade made from the bronze scales of a defeated Gorgon, paralyzing enemies with fear.",
  attack: 65,
  defense: 60,
  tier: 9,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 165,
};
