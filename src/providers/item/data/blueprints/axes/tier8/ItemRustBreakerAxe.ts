import { IEquippableMeleeTier8WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRustBreakerAxe: IEquippableMeleeTier8WeaponBlueprint = {
  key: AxesBlueprint.RustBreakerAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/rust-breaker-axe.png",
  name: "Rust Breaker Axe",
  description: "A blade coated with a special material that erodes enemy armor, weakening their defense with each hit.",
  weight: 2.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 62,
  defense: 58,
  tier: 8,
  rangeType: EntityAttackType.Melee,
  basePrice: 88,
};
