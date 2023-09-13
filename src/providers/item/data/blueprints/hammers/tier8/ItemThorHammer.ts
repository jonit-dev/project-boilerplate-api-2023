import { IEquippableMeleeTier8WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HammersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemThorHammer: IEquippableMeleeTier8WeaponBlueprint = {
  key: HammersBlueprint.ThorHammer,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "hammers/thor-hammer.png",
  name: "Thor Hammer",
  description:
    "A mythical hammer endowed with the power of thunder and lightning, often requiring worthiness to wield.",
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 62,
  defense: 38,
  tier: 8,
  rangeType: EntityAttackType.Melee,
};
