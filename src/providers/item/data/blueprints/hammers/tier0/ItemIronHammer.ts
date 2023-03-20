import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { HammersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIronHammer: IEquippableMeleeTier0WeaponBlueprint = {
  key: HammersBlueprint.IronHammer,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "hammers/iron-hammer.png",
  name: "Iron Hammer",
  description: "An iron hammer.",
  attack: 8,
  defense: 6,
  tier: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
