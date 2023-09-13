import { IEquippableMeleeTier8WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHexBladeDagger: IEquippableMeleeTier8WeaponBlueprint = {
  key: DaggersBlueprint.HexBladeDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/hex-blade-dagger.png",
  name: "Hex Blade Dagger",
  description: "Infused with dark magic, anyone cut by this dagger experiences intense, unexplainable fear.",
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 63,
  defense: 58,
  tier: 8,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
};
