import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemValkyriesBow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.ValkyriesBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/valkyries-bow.png",
  name: "Valkyries Bow",
  description: "A bow that fires arrows that seek out enemies and deal heavy damage on impact.",
  attack: 17,
  defense: 6,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 8,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.GoldenArrow,
    RangedWeaponsBlueprint.ShockArrow,
    RangedWeaponsBlueprint.PoisonArrow,
  ],
  isTwoHanded: true,
  basePrice: 160,
};
